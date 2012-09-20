/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function () {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		AWS = require('ti.aws');
		AWS.authorize(Titanium.App.Properties.getString('aws.key'), Titanium.App.Properties.getString('aws.secret'));
	}//end init
	
	this.name = "ses";
	
	this.testSimple = function(testRun) {
		var w = Ti.UI.createWindow();
		w.open();
		var data = [Ti.UI.createTableViewRow({title: 'blah'})];
		var tv = Ti.UI.createTableView({data:data});
		w.add(tv);
		setTimeout(function(){
				tv.appendRow( Ti.UI.createTableViewRow({title:'blah2', header:'header1'}) );
				setTimeout(function() {
					valueOf(testRun, tv.data.length).shouldBe(2);
					finish(testRun);
				}, 1000);
			},1000);
	}//end testSimple
	
	this.testsesDeleteVerifiedEmailAddressWithoutEmailAddress = function(testRun) {
			
			var params = {
				'emailAddress' : ''//empty EmailAddress
			};
			AWS.SES.deleteVerifiedEmailAddress(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}// end testsesDeleteVerifiedEmailAddressWithoutEmailAddress
		
		/**
		 *Test case for deleteVerifiedEmailAddress by passing a valid EmailAddress
		 */
		this.testsesdeleteVerifiedEmailAddress = function(testRun) {
			var params = {
				'emailAddress' : 'test@test.com'//Required
			};
			AWS.SES.verifyEmailAddress(params, function(data) {
				AWS.SES.deleteVerifiedEmailAddress(params, function(data) {
					finish(testRun);
				}, function(error) {
					Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();
				});
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();
			});
		}

		/**
		 *Test case for deleteVerifiedEmailAddress by passing a Invalid EmailAddress
		 */
		this.testsesDeleteVerifiedEmailAddressWithInvalidEmailAddress = function(testRun) {
			var params = {
				'emailAddress' : 'caxvcx'//invalid EmailAddress
			};
			AWS.SES.deleteVerifiedEmailAddress(params, function(data) {
				finish(testRun);
			valueOf(testRun, true).shouldBeFalse();
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		
		//***************getSendQuota test cases start**************

		/*
		 *Test case for getSendQuota
		 */
		this.testsesGetSendQuota = function(testRun) {
			var params = {

			};
			AWS.SES.getSendQuota(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();finish(testRun);
			valueOf(testRun, true).shouldBeFalse();
			});
		}
		//*************getSendQuota test cases ends**************
		//***************getSendStatistics test cases start**************

		/*
		 *Test case for getSendStatistics
		 */
		this.testsesGetSendQuota = function(testRun) {
			var params = {
				
			};
			AWS.SES.getSendQuota(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}

		//*************getSendStatistics test cases ends**************

		//*************** listVerifiedEmailAddresses test cases start**************

		/*
		 *Test case for listVerifiedEmailAddresses
		 */
		this.testsesListVerifiedEmailAddresses = function(testRun) {
			var params = {

			};
			AWS.SES.listVerifiedEmailAddresses(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		//************* listVerifiedEmailAddresses test cases ends**************

		//***************verifyEmailAddress test cases start**************

		/**
		 *Test case for verifyEmailAddress without passing EmailAddress
		 */
		this.testsesVerifyEmailAddressWithoutEmailAddress = function(testRun) {
			var params = {
				'emailAddress' : ''//empty EmailAddress
			};
			AWS.SES.verifyEmailAddress(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}

		/**
		 *Test case for verifyEmailAddress by passing a valid EmailAddress
		 * 
		 */
		this.testsesVerifyEmailAddress = function(testRun) {
			var params = {
				'emailAddress' : 'test@test.com'//Required
			};
			AWS.SES.verifyEmailAddress(params, function(data) {
				AWS.SES.deleteVerifiedEmailAddress(params, function(data) {
					finish(testRun);
				}, function(error) {
					Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
				});
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		/**
		 *Test case for verifyEmailAddress by passing a Invalid EmailAddress
		 */
		this.testsesVerifyEmailAddressWithInvalidEmailAddress = function(testRun) {
			var params = {
				'emailAddress' : 'bdvjhdbdgv'//invalid EmailAddress
			};
			AWS.SES.verifyEmailAddress(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		//*************verifyEmailAddress test cases ends**************
		//***************sendEmail test cases start**************

		/**
		 *Test case for sendEmail without passing Destination
		 */
		this.testsesSendEmailWithoutDestination = function(testRun) {
			var params = {
				'destination' : '', //empty EmailAddress
				'message' : 'Hi',
				'source' : 'test@gmail.com'
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			valueOf(testRun, true).shouldBeFalse();
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		/**
		 *Test case for sendEmail without passing Message
		 */
		this.testsesSendEmailWithoutMessage = function(testRun) {
			var params = {
				'destination' : 'test@gmail.com',
				'message' : '', //Empty
				'source' : 'test@gmail.com'
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		/**
		 *Test case for sendEmail without passing Source
		 */
		this.testsesSendEmailWithoutSource = function(testRun) {
			var params = {
				'destination' : 'test@test.com', //Required
				'message' : 'Hi', //Required
				'source' : ''//Empty
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		/**
		 *Test case for sendEmail by passing a valid Destination,Message,Source
		 */
		this.testsesSendEmail = function(testRun) {
			var params = {
				'destination' : 'test@gmail.com', //Required
				'message' : 'hi', //Required
				'source' : 'test@gmail.com'//Required
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
		
		/**
		 *Test case for sendEmail by passing a Invalid Destination
		 */
		this.testsesSendEmailWithInvalidDestination = function(testRun) {
			var params = {
				'destination' : 'hbegjhrg', //Invalid EmailAddress
				'message' : 'hi', //Required
				'source' : 'rahul0789@gmail.com'//Required
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			valueOf(testRun, true).shouldBeFalse();
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		},
		/**
		 *Test case for sendEmail by passing a Invalid Source
		 */
		this.testsesSendEmailWithInvalidSource = function(testRun) {
			var params = {
				'destination' : 'test@test.com', //Required
				'message' : 'hi', //Required
				'source' : 'bndjvnd'//Invalid
			};
			AWS.SES.sendEmail(params, function(data) {
				finish(testRun);
			valueOf(testRun, true).shouldBeFalse();
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		},
		//*************sendEmail test cases ends**************
		//***************sendRawEmail test cases start**************

		/**
		 *Test case for sendRawEmail without passing RawMessage
		 */
		this.testsesSendRawEmailWithoutRawMessage = function(testRun) {
		
			var params = {
				'rawMessage' : ''//empty RawMessage
			};
			AWS.SES.sendRawEmail(params, function(data) {
				finish(testRun);
			}, function(error) {
				Ti.API.debug(error); valueOf(testRun, true).shouldBeFalse(); finish(testRun);
			});
		}
	});	
	
	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this, 30000);
	
};
