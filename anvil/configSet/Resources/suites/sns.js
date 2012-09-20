/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function () {
	var finish;
	var valueOf;
	var AWS;
	var awsAccountId;
	var arn;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		AWS = require('ti.aws');
		AWS.authorize(Titanium.App.Properties.getString('aws.key'), Titanium.App.Properties.getString('aws.secret'));
		awsAccountId = Titanium.App.Properties.getString('aws-account-id');
		arn = '';
	}
	
	this.name = "sns";
	
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
	
	
		//*************Create Topic test cases start**************
		/**
		 *Test case for creating topic WithEmpty  name.
		 */
	this.testcreateEmptyTopic_as_async = function(testRun) {
			var params = {
				'Name' : ''//Empty
			};
			AWS.SNS.createTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for creating topic by  an Invalid name.
		 */
this.testcreateInvalidTopic_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillInvalidTopic#'//Only uppercase and lowercase ASCII letters, numbers, and hyphens valid.
			};
			AWS.SNS.createTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for creating topic by  a valid topic name.
		 */
		this.testcreateValidTopic_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic'//Required
			};
			AWS.SNS.createTopic(params, function(data) {
				finish(testRun);
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn
				};
				AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
				}, function(error) {
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************Create Topic test cases end**************

		//****************List Topic test cases start***************

		/**
		 *Test case for listing all topics.
		 */
		this.testlistTopic_as_async = function(testRun) {
			var params = {
			};
			AWS.SNS.listTopics(params, function(data) {
				finish(testRun);
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************List Topic test cases end**************
		//************Confirm Subscription test cases start.**************
		/**
		 *Test case for Confirming Subscription WithEmpty  Token.
		 */
		this.testconfirmSubscriptionWithEmptyToken_as_async = function(testRun) {
			var params = {
				'Token' : '', //Token is empty
				'TopicArn' : arn
			};
			AWS.SNS.confirmSubscription(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for Confirming Subscription with invalid Token.
		 */
		this.testconfirmSubscriptionWithInvalidToken_as_async = function(testRun) {
			var params = {
				'Token' : '2336412f37fb687f5d51e6e241d09c805a5ajhhjkagjkaskluagaudy8789689689asdgt76627sghd6895be8b31efbc4483c32d', //Invalid token
				'TopicArn' : arn
			};
			AWS.SNS.confirmSubscription(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for Confirming Subscription WithEmpty TopicArn.
		 */
		this.testconfirmSubscriptionWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'Token' : '2336412f37fb687f5d51e6e241d09c805bfad098d77ccb5b355099356f979ecf6c8f579df806b3f9ec20aabea6f9a023f58bcd0bc07ba237c5dd0b70c46d4404b422cf07c1bc1bb415c125276db91e9e55c447cc3be68cec13165ed9462fb84c458137fdb3d257a0fd25cb65257cc249',
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.confirmSubscription(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for Confirming Subscription with invalid TopicArn.
		 */
		this.testconfirmSubscriptionWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'Token' : '2336412f37fb687f5d51e6e241d09c805bfad098d77ccb5b355099356f979ecf6c8f579df806b3f9ec20aabea6f9a023f58bcd0bc07ba237c5dd0b70c46d4404b422cf07c1bc1bb415c125276db91e9e55c447cc3be68cec13165ed9462fb84c458137fdb3d257a0fd25cb65257cc249',
				'TopicArn' : 'arn:aws:sns:us-east-'//Invalid TopicArn
			};
			AWS.SNS.confirmSubscription(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for Confirming Subscription.
		 */
		this.testconfirmSubscription_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic12'//Required
			};
			AWS.SNS.createTopic(params, function(data) {
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'Token' : Titanium.App.Properties.getString('token'),
					'TopicArn' : arn
				};
				AWS.SNS.confirmSubscription(params, function(data) {
					finish(testRun);
					var params = {
						'TopicArn' : arn
					};
					AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************Confirm Subscription test cases end**************

		//****************Delete Topic test cases start.*****************

		/**
		 *Test case for deleting topic WithEmpty TopicArn.
		 */
		this.testdeleteTopicWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.deleteTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for deleting topic with invalid TopicArn.
		 */
		this.testdeleteTopicWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1'//TopicArn is invalid
			};
			AWS.SNS.deleteTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for deleting topic.
		 */
		this.testdeleteTopic_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopicForDeletion'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//Creating a topic for deletion
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn
				};
				AWS.SNS.deleteTopic(params, function(data) {//Calling deleteTopic API
					finish(testRun);
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************Delete Topic test cases end**************

		//**************GetSubscriptionAttributes test cases start.**************

		/**
		 *Test case for getting SubscriptionAttributes WithEmpty  SubscriptionArn.
		 */
		this.testgetSubscriptionAttributesWithEmptySubscriptionArn_as_async = function(testRun) {
			var params = {
				'SubscriptionArn' : ''//SubscriptionArn is empty
			};
			AWS.SNS.getSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for getting SubscriptionAttributes with invalid SubscriptionArn.
		 */
		this.testgetSubscriptionAttributesWithInvalidSubscriptionArn_as_async = function(testRun) {
			var params = {
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'//SubscriptionArn is invalid
			};
			AWS.SNS.getSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for getting SubscriptionAttributes.
		 */
		this.testgetSubscriptionAttributes_as_async = function(testRun) {
			var params = {
				'QueueName' : 'DrillBitTestQueue886'
			};
			AWS.SQS.createQueue(params, function(data) {//Creating queue
				var queueUrl = data.CreateQueueResult[0].QueueUrl[0];
				var params = {
					'Name' : 'DrillBitTestTopic12345'//Required
				};
				AWS.SNS.createTopic(params, function(data) {//Craeting topic
					arn = data.CreateTopicResult[0].TopicArn[0];
					var params = {
						'Endpoint' : 'arn:aws:sqs:us-east-1:'+awsAccountId+':DrillBitTestQueue886', //Required
						'Protocol' : 'sqs', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.subscribe(params, function(data) {//Calling subscribe
						var subscriptionArn = data.SubscribeResult[0].SubscriptionArn[0];
						var params = {
							'SubscriptionArn' : subscriptionArn//Required
						}
						AWS.SNS.getSubscriptionAttributes(params, function(data) {//Calling getSubscriptionAttributes
							finish(testRun);
							AWS.SNS.unsubscribe(params, function(data) {//unsubscribing
								var params = {
									'AWSAccountId' : awsAccountId,
									'QueueName' : 'DrillBitTestQueue886'
								};
								AWS.SQS.deleteQueue(params, function(data) {//Deleting queue
									var params = {
										'TopicArn' : arn//Required
									};
									AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic

									}, function(error) {
									});
								}, function(error) {
								});
							}, function(error) {
							});
						}, function(error) {
							valueOf(testRun, true).shouldBeFalse();finish(testRun);
						});
					}, function(error) {
						valueOf(testRun, true).shouldBeFalse();finish(testRun);
					});
				}, function(error) {
					valueOf(testRun, true).shouldBeFalse();finish(testRun);
				});
			}, function(error) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		//*************GetSubscriptionAttributes test cases end**************

		//*************GetTopicAttributes test cases start****************

		/**
		 *Test case for getting TopicAttributes WithEmpty TopicArn.
		 */
		this.testgetTopicAttributesWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.getTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for getting TopicAttributes with invalid TopicArn.
		 */
		this.testgetTopicAttributesWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311'//TopicArn is invalid
			};
			AWS.SNS.getTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for getting TopicAttributes.
		 */
		this.testgetTopicAttributes_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic12'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//Creating a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn//Required
				};
				AWS.SNS.getTopicAttributes(params, function(data) {//Calling getTopicAttributes on the topic
					finish(testRun);
					AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************GetTopicAttributes test cases end**************

		//****************List Subscriptions test cases start.***************

		/**
		 *Test case for listing all subscriptions.
		 */
		this.testlistSubscriptions_as_async = function(testRun) {
			var params = {
			};
			AWS.SNS.listSubscriptions(params, function(data) {
				finish(testRun);
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************List Subscriptions test cases end**************

		//****************List Subscriptions By Topic test cases start.***************

		/**
		 *Test case for listing Subscriptions By Topic WithEmpty TopicArn.
		 */
		this.testlistSubscriptionsByTopicWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.listSubscriptionsByTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for listing Subscriptions By Topic with invalid TopicArn.
		 */
		this.testlistSubscriptionsByTopicWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311'//TopicArn is invalid
			};
			AWS.SNS.listSubscriptionsByTopic(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for listing all subscriptions By Topic.
		 */
		this.testlistSubscriptionsByTopic_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic123'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//creating a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn//Required
				};
				AWS.SNS.listSubscriptionsByTopic(params, function(data) {//Calling listSubsciptionByTopic on the topic
					finish(testRun);
					AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************List Subscriptions test cases end***************

		//****************Publish test cases start.***************

		/**
		 *Test case for publishing WithEmpty  Message.
		 */
		this.testpublishWithEmptyMessage_as_async = function(testRun) {
			var params = {
				'Message' : '', //Message is empty
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.publish(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for publishing WithEmpty TopicArn.
		 */
		this.testpublishWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'Message' : 'Hello,this is a test message',
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.publish(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for publishing with invalid TopicArn.
		 */
		this.testpublishWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'Message' : 'Hello,this is a test message',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311'//TopicArn is invalid
			};
			AWS.SNS.publish(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for publishing.
		 */
		this.testpublish_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic1234'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//creating a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'Message' : 'Hello,this is a test message', //Message is required
					'TopicArn' : arn//Required
				};
				AWS.SNS.publish(params, function(data) {//Calling publish on the topic
					finish(testRun);
					var params = {
						'TopicArn' : arn//Required
					};
					AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************Publish test cases end**************

		//*************Remove Permission test cases start****************
		/**
		 *Test case for removing permission WithEmpty TopicArn.
		 */
		this.testremovePermissionWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'Label' : '1',
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.removePermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for removing permission with invalid TopicArn.
		 */
		this.testremovePermissionWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'Label' : '1',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311'//TopicArn is invalid
			};
			AWS.SNS.removePermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for removing permission.
		 */
		this.testremovePermission_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic1234'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//Craeting a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn,
					'Label' : 'MyPermission',
					'ActionName.member.1' : 'GetTopicAttributes',
					'AWSAccountId.member.1' : '682109303140'
				};
				AWS.SNS.addPermission(params, function(data) {//Calling addPermission on the topic
					var params = {
						'Label' : 'MyPermission', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.removePermission(params, function(data) {//Calling removePermission to remove the permission
						finish(testRun);
						var params = {
							'TopicArn' : arn//Required
						};
						AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
						}, function(error) {
						});
					}, function(error) {
						callback.failed('Some error occured')
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//***************Remove Permission test cases end****************

		//****************SetSubscriptionAttributes test cases start***************

		/**
		 *Test case for setting SubscriptionAttributes WithEmpty  AttributeName.
		 */
		this.testsetSubscriptionAttributesWithEmptyAttributeName_as_async = function(testRun) {
			var params = {
				'AttributeName' : '', //AttributeName is empty
				'AttributeValue' : '',
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting:b7c57b3c-a8cf-4277-9d5a-648fa0dcd885'
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes with invalid AttributeName.
		 */
		this.testsetSubscriptionAttributesWithInvalidAttributeName_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DeliveryPolicySNS', //AttributeName is invalid
				'AttributeValue' : '',
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting:b7c57b3c-a8cf-4277-9d5a-648fa0dcd885'
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes WithEmpty AttributeValue.
		 */
		this.testsetSubscriptionAttributesWithEmptyAttributeValue_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DeliveryPolicy',
				'AttributeValue' : '{}', //AttributeValue is empty
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting:b7c57b3c-a8cf-4277-9d5a-648fa0dcd885'
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes with invalid AttributeValue.
		 */
		this.testsetSubscriptionAttributesWithInvalidAttributeValue_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DeliveryPolicy',
				'AttributeValue' : '{value: \'hdfks\'}', //AttributeValue is invalid
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting:b7c57b3c-a8cf-4277-9d5a-648fa0dcd885'
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes WithEmpty SubscriptionArn.
		 */
		this.testsetSubscriptionAttributesWithEmptySubscriptionArn_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DeliveryPolicy',
				'AttributeValue' : '',
				'SubscriptionArn' : ''//SubscriptionArn is empty
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes with invalid SubscriptionArn.
		 */
		this.testsetSubscriptionAttributesWithInvalidSubscriptionArn_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DeliveryPolicy',
				'AttributeValue' : '',
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'//SubscriptionArn is invalid
			};
			AWS.SNS.setSubscriptionAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting SubscriptionAttributes.
		 */
		this.testsetSubscriptionAttributes_as_async = function(testRun) {
			var params = {
				'QueueName' : 'DrillBitTestQueue884'
			};
			AWS.SQS.createQueue(params, function(data) {//Creating queue
				var params = {
					'Name' : 'DrillBitTestTopic12346'//Required
				};
				AWS.SNS.createTopic(params, function(data) {//Creating topic
					arn = data.CreateTopicResult[0].TopicArn[0];
					var params = {
						'Endpoint' : 'arn:aws:sqs:us-east-1:'+awsAccountId+':DrillBitTestQueue884', //Required
						'Protocol' : 'sqs', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.subscribe(params, function(data) {//Calling subscribe
						var subscriptionArn = data.SubscribeResult[0].SubscriptionArn[0];
						var params = {
							'AttributeName' : 'DeliveryPolicy', //Required
							'AttributeValue' : '{}', //Required
							'SubscriptionArn' : subscriptionArn//Required
						}
						AWS.SNS.setSubscriptionAttributes(params, function(data) {//Calling setSubscriptionAttributes
							finish(testRun);
							var params = {
								'SubscriptionArn' : subscriptionArn
							};
							AWS.SNS.unsubscribe(params, function(data) {//Calling unsubscribe
								var params = {
									'AWSAccountId' : awsAccountId,
									'QueueName' : 'DrillBitTestQueue884'
								};
								AWS.SQS.deleteQueue(params, function(data) {//deleting the queue
									var params = {
										'TopicArn' : arn//Required
									};
									AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic

									}, function(error) {
									});
								}, function(error) {
								});
							}, function(error) {
							});
						}, function(error) {
							valueOf(testRun, true).shouldBeFalse();finish(testRun);
						});
					}, function(error) {
						valueOf(testRun, true).shouldBeFalse();finish(testRun);
					});
				}, function(error) {
					valueOf(testRun, true).shouldBeFalse();finish(testRun);
				});
			}, function(error) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		//*************SetSubscriptionAttributes test cases end**************

		//****************SetTopicAttributes test cases start***************

		/**
		 *Test case for setting TopicAttributes WithEmpty AttributeName.
		 */
		this.testsetTopicAttributesWithEmptyAttributeName_as_async = function(testRun) {
			var params = {
				'AttributeName' : '', //AttributeName is empty
				'AttributeValue' : 'TestValue',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.setTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting TopicAttributes with invalid AttributeName.
		 */
		this.testsetTopicAttributesWithInvalidAttributeName_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DisplayNameSNS', //AttributeName is invalid
				'AttributeValue' : 'TestValue',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.setTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting TopicAttributes WithEmpty AttributeValue.
		 */
		this.testsetTopicAttributesWithEmptyAttributeValue_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DisplayName',
				'AttributeValue' : '', //AttributeValue is empty
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.setTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting TopicAttributes WithEmpty TopicArn.
		 */
		this.testsetTopicAttributesWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DisplayName',
				'AttributeValue' : 'TestValue',
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.setTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting TopicAttributes with invalid TopicArn.
		 */
		this.testsetTopicAttributesWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'AttributeName' : 'DisplayName',
				'AttributeValue' : 'TestValue',
				'TopicArn' : ''//TopicArn is invalid
			};
			AWS.SNS.setTopicAttributes(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for setting TopicAttributes.
		 */
		this.testsetTopicAttributes_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic1234'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//creating a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'AttributeName' : 'DisplayName', //Required
					'AttributeValue' : 'TestValue', //Required
					'TopicArn' : arn//Required
				};
				AWS.SNS.setTopicAttributes(params, function(data) {//Calling setTopicAttributes on the topic
					finish(testRun);
					var params = {
						'TopicArn' : arn//Required
					};
					AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		//*************SetTopicAttributes test cases end**************

		//****************Subscribe test cases start***************

		/**
		 *Test case for subscribing WithEmpty Endpoint.
		 */
		this.testsubscribeWithEmptyEndpoint_as_async = function(testRun) {
			var params = {
				'Endpoint' : '', //Endpoint is empty
				'Protocol' : 'email',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing with invalid Endpoint.
		 */
		this.testsubscribeWithInvalidEndpoint_as_async = function(testRun) {
			var params = {
				'Endpoint' : 'test.test@globallogic', //Endpoint is invalid
				'Protocol' : 'email',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing WithEmpty Protocol.
		 */
		this.testsubscribeWithEmptyProtocol_as_async = function(testRun) {
			var params = {
				'Endpoint' : 'test@test.com',
				'Protocol' : '', //Protocol is empty
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing with invalid Protocol.
		 */
		this.testsubscribeWithInvalidProtocol_as_async = function(testRun) {
			var params = {
				'Endpoint' : 'test@test.com',
				'Protocol' : 'invalidProtocol', //Protocol is invalid
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing WithEmpty  TopicArn.
		 */
		this.testsubscribeWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'Endpoint' : 'test@test.com',
				'Protocol' : 'email',
				'TopicArn' : ''//TopicArn is empty
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing with invalid TopicArn.
		 */
		this.testsubscribeWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'Endpoint' : 'test@test.com',
				'Protocol' : 'email',
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311'//TopicArn is invalid
			};
			AWS.SNS.subscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for subscribing.
		 */
		this.testsubscribe_as_async = function(testRun) {
			var params = {
				'QueueName' : 'DrillBitTestQueue888'
			};
			AWS.SQS.createQueue(params, function(data) {// Creating queue
				var queueUrl = data.CreateQueueResult[0].QueueUrl[0];
				var params = {
					'Name' : 'DrillBitTestTopic12343'//Required
				};
				AWS.SNS.createTopic(params, function(data) {//Creating topic
					arn = data.CreateTopicResult[0].TopicArn[0];
					var params = {
						'Endpoint' : 'arn:aws:sqs:us-east-1:'+awsAccountId+':DrillBitTestQueue888', //Required
						'Protocol' : 'sqs', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.subscribe(params, function(data) {//Calling subscribe
						finish(testRun);
						var subscriptionArn = data.SubscribeResult[0].SubscriptionArn[0];
						var params = {
							'SubscriptionArn' : subscriptionArn
						};
						AWS.SNS.unsubscribe(params, function(data) {//Calling unsubscribe
							var params = {
								'AWSAccountId' : awsAccountId,
								'QueueName' : 'DrillBitTestQueue888'
							};
							AWS.SQS.deleteQueue(params, function(data) {//Deleting the queue
								var params = {
									'TopicArn' : arn//Required
								};
								AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic

								}, function(error) {
								});
							}, function(error) {
							});
						}, function(error) {
						});
					}, function(error) {
						valueOf(testRun, true).shouldBeFalse();finish(testRun);
					});
				}, function(error) {
					valueOf(testRun, true).shouldBeFalse();finish(testRun);
				});
			}, function(error) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		//*************Subscribe test cases end**************

		//****************Unsubscribe test cases start***************
		/**
		 *Test case for unsubscribing WithEmpty SubscriptionArn.
		 */
		this.testunsubscribeWithEmptySubscriptionArn_as_async = function(testRun) {
			var params = {
				'SubscriptionArn' : ''//SubscriptionArn is empty
			};
			AWS.SNS.unsubscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for unsubscribing with invalid SubscriptionArn.
		 */
		this.testunsubscribeWithInvalidSubscriptionArn_as_async = function(testRun) {
			var params = {
				'SubscriptionArn' : 'arn:aws:sns:us-east-1:704687501311:LastTesting'//SubscriptionArn is invalid
			};
			AWS.SNS.unsubscribe(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for unsubscribing.
		 */
		this.testunsubscribe_as_async = function(testRun) {
			var params = {
				'QueueName' : 'DrillBitTestQueue889'
			};
			AWS.SQS.createQueue(params, function(data) {
				var queueUrl = data.CreateQueueResult[0].QueueUrl[0];
				var params = {
					'Name' : 'DrillBitTestTopic12342'//Required
				};
				AWS.SNS.createTopic(params, function(data) {
					arn = data.CreateTopicResult[0].TopicArn[0];
					var params = {
						'Endpoint' : 'arn:aws:sqs:us-east-1:'+awsAccountId+':DrillBitTestQueue889', //Required
						'Protocol' : 'sqs', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.subscribe(params, function(data) {//Calling Subscribe
						var subscriptionArn = data.SubscribeResult[0].SubscriptionArn[0];
						var params = {
							'SubscriptionArn' : subscriptionArn
						};
						AWS.SNS.unsubscribe(params, function(data) {//Calling unsubscribe
							finish(testRun);
							var params = {
								'AWSAccountId' : awsAccountId,
								'QueueName' : 'DrillBitTestQueue889'
							};
							AWS.SQS.deleteQueue(params, function(data) {//Deleting the queue
								var params = {
									'TopicArn' : arn//Required
								};
								AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic

								}, function(error) {
								});
							}, function(error) {
							});
						}, function(error) {
							valueOf(testRun, true).shouldBeFalse();finish(testRun);
						});
					}, function(error) {
						valueOf(testRun, true).shouldBeFalse();finish(testRun);
					});
				}, function(error) {
					valueOf(testRun, true).shouldBeFalse();finish(testRun);
				});
			}, function(error) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			});
		}
		//*************Unsubscribe test cases end**************
		//***************addPermission test cases start**************
		/**
		 *Test case for addPermission without passing any parameter
		 */
		this.testaddPermissionWithEmptyParams_as_async = function(testRun) {
			params = {
				'TopicArn' : '',
				'Label' : '',
				'ActionName.member.1' : '',
				'AWSAccountId.member.1' : ''
			}
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission without passing TopicArn
		 */
		this.testaddPermissionWithEmptyTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : '',
				'Label' : 'MyPermission',
				'ActionName.member.1' : 'GetTopicAttributes',
				'AWSAccountId.member.1' : '682109303140'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission without passing label
		 */
		this.testaddPermissionWithEmptyLabel_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:My-Topic123456',
				'Label' : '',
				'ActionName.member.1' : 'GetTopicAttributes',
				'AWSAccountId.member.1' : '682109303140'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission without passing ActionName
		 */
		this.testaddPermissionWithEmptyAWSOtherAccountId_as_async = function(testRun) {
			var params = {
				'TopicArn' : '',
				'Label' : 'MyPermission',
				'ActionName.member.1' : '',
				'AWSAccountId.member.1' : '682109303140'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission without passing AWSAccountId
		 */
		this.testaddPermissionWithEmptyActionName_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:My-Topic123456',
				'Label' : 'MyPermission',
				'ActionName.member.1' : 'GetTopicAttributes',
				'AWSAccountId.member.1' : ''
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission with all valid parameters
		 */
		this.testaddPermission_as_async = function(testRun) {
			var params = {
				'Name' : 'DrillBitTestTopic1234'//Required
			};
			AWS.SNS.createTopic(params, function(data) {//Craeting a topic
				arn = data.CreateTopicResult[0].TopicArn[0];
				var params = {
					'TopicArn' : arn,
					'Label' : 'MyPermission',
					'ActionName.member.1' : 'GetTopicAttributes',
					'AWSAccountId.member.1' : '682109303140'
				};
				AWS.SNS.addPermission(params, function(data) {//Calling addPermission on the topic
					finish(testRun);
					var params = {
						'Label' : 'MyPermission', //Required
						'TopicArn' : arn//Required
					};
					AWS.SNS.removePermission(params, function(data) {//Calling removePermission to remove the permission
						var params = {
							'TopicArn' : arn//Required
						};
						AWS.SNS.deleteTopic(params, function(data) {//Calling delete topic for deleting the topic
						}, function(error) {
						});
					}, function(error) {
					});
				}, function(error) {
					callback.failed('Some error occured')
				});
			}, function(error) {
				callback.failed('Some error occured')
			});
		}
		/**
		 *Test case for addPermission with invalid TopicArn
		 */
		this.testaddPermissionWithInvalidTopicArn_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311',
				'Label' : 'MyPermission',
				'ActionName.member.1' : 'InvalidActionName',
				'AWSAccountId.member.1' : '682109303140'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission with invalid ActionName
		 */
		this.testaddPermissionWithInvalidActionName_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311', //Invalid TopicArn
				'Label' : 'MyPermission',
				'ActionName.member.1' : 'GetTopicAttributes',
				'AWSAccountId.member.1' : '682109303140'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		/**
		 *Test case for addPermission with invalid AWSAccountId
		 */
		this.testaddPermissionWithInvalidAWSOtherAccountId_as_async = function(testRun) {
			var params = {
				'TopicArn' : 'arn:aws:sns:us-east-1:704687501311:My-Topic123456',
				'Label' : 'MyPermission',
				'ActionName.member.1' : 'GetTopicAttributes',
				'AWSAccountId.member.1' : '682109303140%876'
			};
			AWS.SQS.addPermission(params, function(data) {
				valueOf(testRun, true).shouldBeFalse();finish(testRun);
			}, function(error) {
				finish(testRun);
			});
		}
		//*************addPermission test cases ends**************
	});
	
	
	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this, 30000);
	
};
