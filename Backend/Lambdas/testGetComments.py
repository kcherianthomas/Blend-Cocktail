import json
import boto3 
import os
import logging
separator = "###"
logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):
    logger.info("printing testGetComments")
    logger.info(event)
    cocktailid = event['params']['querystring']['cocktailid']
    #cocktailid = "1"
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['TABLE_NAME'])
    comments = []
    users = []
    response = table.get_item(Key={'id': cocktailid})
    if  'Item' in response.keys():
        comments = response['Item']['comments'].split(separator)
        users = response['Item']['user'].split(separator)
    responseToSend = [];
    for i in range(0,len(users)):
        responseToSend.append({'comment':comments[i], 'username': users[i]})
    print(responseToSend)
    return {
        'statusCode': 200,
        'body': json.dumps(responseToSend)
    }
