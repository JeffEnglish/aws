/**
 * Routine that generates a SignedURL based upon the paramters provided making use of the AWSSigner
 *
 * @param actionName - Action to be invoked by AWS
 * @param params - Parameters to be serialized into the URL
 * @param accessKeyId - AccessKey provided by the user
 * @param secretKey - SecretKey provided by the user
 * @param endpoint - Service Endpoint
 * @param version - Version of the Service to be invoked
 */

Ti.include("/lib/awssigner.js");


var utility;
if(typeof exports !== 'undefined')
	utility = exports;
else
	utility = {}

/**
 * Routine that contructs querystring as payload without an URl with it. This payload will be passed to HttpClient as parameter in send
 * @param - params- Its a javascript object that contains all elements required to create payload
 * @param - accessKeyId - Used to sign the payload
 * @param - secretKey - Used to sign the payload
 * @param - endpoint - contains the url which need to be hit, is used to extract the host part from it
 */
utility.generatePayload = function(params, accessKeyId, secretKey, endpoint) {
	var host = endpoint.replace(/.*:\/\//, "");
	var payload = null;

	var signer = new AWSV2Signer(accessKeyId, secretKey);
	params = signer.sign(params, new Date(), {
		"verb" : "POST",
		"host" : host,
		"uriPath" : "/"
	});

	var encodedParams = [];
	for(var key in params) {
		if(params[key] !== null) {
			encodedParams.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
		} else {
			encodedParams.push(encodeURIComponent(key));
		}
	}
	payload = encodedParams.join("&");
	return payload;
}

utility.generateSignedURL = function(actionName, params, accessKeyId, secretKey, endpoint, version) {
	var host = endpoint.replace(/.*:\/\//, "");
	var payload = null;
	var displayUri = endpoint;
	var uriPath = "/";

	params.Action = actionName;
	params.Version = version;
	var signer = new AWSV2Signer(accessKeyId, secretKey);

	//This is to append AWSAccountId along with QueueName in Endpoint for SQS
	if(params.hasOwnProperty('AWSAccountId') && params.hasOwnProperty('QueueName')) {
		uriPath += params.AWSAccountId + "/" + params.QueueName + "/";
		displayUri += "/" + params.AWSAccountId + "/" + params.QueueName + "/";
	}
	params = signer.sign(params, new Date(), {
		"verb" : "GET",
		"host" : host,
		"uriPath" : uriPath
	});

	var encodedParams = [];
	for(var key in params) {
		if(params[key] !== null) {
			encodedParams.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
		} else {
			encodedParams.push(encodeURIComponent(key));
		}
	}
	payload = encodedParams.join("&");
	displayUri += "?" + payload;
	return displayUri;
}
/**
 * Routine that constructs the complete email and passes that back as a string
 * @param - Its a javascript object contains all elements required for creating signed string and url endpoint.
 * For More info Pls refer to : http://docs.amazonwebservices.com/ses/latest/APIReference
 */
utility.generateSESParams = function(params) {
	if(params.hasOwnProperty('emailAddress')) {
		params.paramString += '&EmailAddress=' + params.emailAddress;
	} else if(params.hasOwnProperty('destination')) {
		params.paramString += generateDestination(params.destination, params.isRawMessage);
		if(params.hasOwnProperty('message')) {
			if(params.message.hasOwnProperty('body')) {
				params.paramString += generateMessageBody(params.message.body);
			}
			if(params.message.hasOwnProperty('subject')) {
				params.paramString += '&Message.Subject.Data=' + params.message.subject;
			}
		}
		if(params.hasOwnProperty('replyTo')) {
			params.paramString += generateReplyTo(params.replyTo);
		}
		if(params.hasOwnProperty('returnPath')) {
			params.paramString += '&ReturnPath=' + params.returnPath;
		}
		if(params.hasOwnProperty('source')) {
			params.paramString += '&Source=' + params.source;
		}
	}
	if(params.hasOwnProperty('rawMessage')) {
		params.paramString += '&RawMessage.Data=' + params.rawMessage;
	}
	return;
}
/**
 *  Loops through all the email address given by the user and adds it to destination
 *  For Ex "To" can have more then 1 email address this function loops on that value.
 * * For more info pls refer to : http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendEmail.html
 */

function generateDestination(destination, isRawMessage) {
	var destinationString = '';
	if(isRawMessage) {
		for( i = 1; i <= destination.length; i++) {
			destinationString += '&Destinations.member.' + i + '=' + destination[i - 1];
		}
	} else {
		for(key in destination) {
		//The value for "key" could be "to", "cc", "bcc", so we need to make the first letter as caps
		//we can also get rid of the below line of code but in that case user will have to pass "To" instead "to", which is not a 
		//good coding practice while making javascript objects 
			var type = key.substr(0, 1).toUpperCase() + key.substr(1);
			for( i = 1; i <= destination[key].length; i++) {
				destinationString += '&Destination.' + type + 'Addresses.member.' + i + '=' + destination[key][i - 1];
			}
		}
	}
	return destinationString;
}

/**
 * The reply-to email address(es) for the message. If the recipient replies to the message, each reply-to address will receive the reply
 * For more info pls refer to : http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendEmail.html
 */

function generateReplyTo(replyTo) {
	var replyToString = '';
	for( i = 1; i <= replyTo.length; i++) {
		replyToString += '&ReplyToAddresses.member.' + i + '=' + replyTo[i - 1];
	}
	return replyToString;
}

/**
 * The message to be sent.
 * For more info pls refer to : http://docs.amazonwebservices.com/ses/latest/APIReference/API_SendEmail.html
 */
function generateMessageBody(messageBody) {
	var messageBodyString = '';
	for(key in messageBody) {
		var type = key.substr(0, 1).toUpperCase() + key.substr(1);
		messageBodyString += '&Message.Body.' + type + '.Data=' + messageBody[key];
	}
	return messageBodyString;
}




/**
 * Routine that contructs URL for SQS.
 * @param - params- Its a javascript object that contains all elements required to create payload
 * @param - accessKeyId - Used to sign the payload
 * @param - secretKey - Used to sign the payload
 * @param - endpoint - contains the url which need to be hit, is used to extract the host part from it
 */

utility.generateSQSURL = function(actionName, params, accessKeyId, secretKey, endpoint, version) {
	if(params.hasOwnProperty('AWSAccountId') && params.hasOwnProperty('QueueName')) {
		endpoint += "/" + params.AWSAccountId + "/" + params.QueueName + "/";
		delete params.AWSAccountId;
		delete params.QueueName;
	}
	var url = endpoint + "?SignatureVersion=1&Action=" + actionName + "&Version=" + encodeURIComponent(version) + "&";
	for(var key in params) {
		var elementName = key;
		var elementValue = params[key];
		if(elementValue) {
			url += elementName + "=" + encodeURIComponent(elementValue) + "&";
		}
	}
	var timestamp = (new Date((new Date).getTime() + ((new Date).getTimezoneOffset() * 60000))).toISODate();
	url += "Timestamp=" + encodeURIComponent(timestamp) + "&SignatureMethod=HmacSHA1&AWSAccessKeyId=" + encodeURIComponent(accessKeyId);
	var stringToSign = getStringToSignForSQS(url);
	var signature= sha.b64_hmac_sha1(secretKey, stringToSign);
	url += "&Signature=" + encodeURIComponent(signature);
	return url;
}

/**
 * Routine that contructs StringToSign for SQS.
 * @param - url- Its a URL containing various paramters 
 */
function getStringToSignForSQS(url) {
    var stringToSign = "";
    var query = url.split("?")[1];
    var params = query.split("&");
    params.sort(ignoreCaseSort);
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        if (param[0] == 'Signature' || undefined  == param[1]) continue;
            stringToSign += param[0] + decodeURIComponent(param[1]);
         }
    return stringToSign;
}

function ignoreCaseSort(a, b) {
    var ret = 0;
    a = a.toLowerCase();
    b = b.toLowerCase();
    if(a > b) ret = 1;
    if(a < b) ret = -1;
    return ret;
}

/**
 * Routine that generates the signed string based upn the params passed
 *
 * @param - Its a javascript object that contains all elements required for creating signed string
 * more on the signing string here --http://docs.amazonwebservices.com/AmazonS3/2006-03-01/dev/RESTAuthentication.html
 */
utility.generateS3Params = function(params) {
	//check if the bucket name is passed by the user. If its passed then include it as part of stringtosign data
	if(params.hasOwnProperty('bucketName')) {
		//check if objectName is passed by user if yes then include it as part of stringtosign data
		if(params.hasOwnProperty('objectName')) {
			//copySource is used by 'Put object copy and Upload part ' api's, which needs to be part of stringtosign
			if(params.hasOwnProperty('copySource')) {
				params.canonicalizedAmzHeaders = '\n' + 'x-amz-copy-source:' + params.copySource;
			} else {
				params.canonicalizedAmzHeaders = '';
			}
			if(params.hasOwnProperty('uploadId')) {
				if(params.hasOwnProperty('partNumber')) {
					params.stringToSign = params.verb + '\n' + params.contentMD5 + '\n' + params.contentType + '\n' + params.curDate + params.canonicalizedAmzHeaders + '\n/' + params.bucketName + '/' + params.objectName + params.subResource + 'partNumber=' + params.partNumber + '&' + 'uploadId=' + params.uploadId;
					params.url = params.url.concat(params.bucketName + '/' + params.objectName + params.subResource + 'partNumber=' + params.partNumber + '&' + 'uploadId=' + params.uploadId);
				} else {
					params.stringToSign = params.verb + '\n' + params.contentMD5 + '\n' + params.contentType + '\n' + params.curDate + params.canonicalizedAmzHeaders + '\n/' + params.bucketName + '/' + params.objectName + params.subResource + 'uploadId=' + params.uploadId;
					params.url = params.url.concat(params.bucketName + '/' + params.objectName + params.subResource + 'uploadId=' + params.uploadId);
				}
			} else {
				params.stringToSign = params.verb + '\n' + params.contentMD5 + '\n' + params.contentType + '\n' + params.curDate + params.canonicalizedAmzHeaders + '\n/' + params.bucketName + '/' + params.objectName + params.subResource;
				params.url = params.url.concat(params.bucketName + '/' + params.objectName + params.subResource);
			}
		} else {
			params.stringToSign = params.verb + '\n' + params.contentMD5 + '\n' + params.contentType + '\n' + params.curDate + '\n/' + params.bucketName + '/' + params.subResource;
			params.url = params.url.concat(params.bucketName + '/' + params.subResource);
		}
	} else {
		params.stringToSign = params.verb + '\n' + params.contentMD5 + '\n' + params.contentType + '\n' + params.curDate + '\n/' + params.subResource;
	}
	return;
}
/* Standard validators supported by the AWS API */
validators = {
	//Checks if all the mandatory parameters specified under data.params, have some value in them
	required : function(request_params, data) {
		var req_key = data.params;
		for( x = 0; x < req_key.length; x++) {
			if((request_params[req_key[x]] == undefined ) || (request_params[req_key[x]] == null) || (request_params[req_key[x]] == "")) {
				return req_key[x];
			} 
		}
		return "";
	},
	rangeValidator : function(request_params, data) {
		var range_key = data.params;
		for( x = 0; x < range_key.length; x++) {
			if(request_params[range_key[x]].length < data.min || request_params[range_key[x]].length > data.max) {
				return   L('lengthValidation');
			} else {
				var iChars = '!@#$%^&*()+=-[]\\\';,./{}|\":<>?';
				for( i = 0; i < iChars.length; i++) {
					if(request_params[range_key[x]].indexOf(iChars[i]) != -1) {
						return L('symbolValidation');
					}
				}
			}
		}
		return "";
	},
	//Checks to see if there are any matching regualar expressions within the Parameters
	//Useful for validating collection of input parameters.
	patternExistsValidator : function(request_params, data) {
	}
}

/**
 * Routine that validates the Parameters provided by the User based upon the Rules associated with the method.
 *
 * NOTE: This is work in progress
 *
 * @param params - Parameters to be serialized into the URL
 * @param validations - List of Validation rules to apply, along with their inherent parameters
 */
utility.validateParams = function(request_params, validations,min,max) {
	var finalresponse = "";
	for(var validationRule in validations) {
		fnValidate = validators[validationRule];
		data = validations[validationRule];
		res = fnValidate(request_params, data);
		if(!res == "") {
			finalresponse = prepareMessage(res, validationRule);
			return finalresponse;
		}
	}
	return finalresponse;
}

prepareMessage = function(response, validationRule) {
	var msg = "";
	var msg = '<?xml version=\"1.0\"?><Response><Errors><Error><Code>' + L(validationRule) + '</Code><Message>' + response + '</Message></Error></Errors></Response>';
	return msg;
}