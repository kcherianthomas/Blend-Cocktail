import json
import boto3 
import os
import logging
separator = "###"
logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):
    logger.info("printing testSaveComments")
    logger.info(event)
    # input from front end
    username = event['body-json']['username']
    usercomment = event['body-json']['comment']
    cocktailID = event['body-json']['cocktailid']
    #username = 'test1'
    #usercomment = 'this cocktail is awesome'
    #cocktailID = '1'
    # input for payload
    payloadComments = ""
    payloadUsers = ""
    # checking if existing comments for the cocktail
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['TABLE_NAME'])
    response = table.get_item(Key={'id': cocktailID})
    if  'Item' in response.keys():
        payloadComments = response['Item']['comments'] + separator
        payloadUsers = response['Item']['user'] + separator
    payloadComments += usercomment
    payloadUsers += username
    client = boto3.client('dynamodb')
    # adding comments and users after appending with existing comments
    response = client.put_item(
        TableName = os.environ['TABLE_NAME'], 
        Item = {
            'id' : {"S" : cocktailID},
            'comments' : {"S" : payloadComments},
            'user' : {"S": payloadUsers}
        }
    )
    
    print(response)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
