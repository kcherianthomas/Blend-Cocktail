import json
import logging
import boto3 
import os


logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):
    logger.info('printing event in testGetUserPreferences')
    logger.info(event)
    userId = event['params']['querystring']['userid']
    ingredients = []
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['TABLE_NAME'])
    response = table.get_item(Key={'userid': userId})
    if 'Item' not in response.keys():
        return {
        'statusCode': 200,
        'body': json.dumps(ingredients)
    }
    print(response['Item']['preferences'])
    responseFromDB = response['Item']['preferences']
    ingredients = responseFromDB.split(",")
    #print(ingredients)
    return {
        'statusCode': 200,
        'body': json.dumps(ingredients)
    }
