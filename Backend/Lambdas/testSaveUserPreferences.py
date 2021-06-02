import json
import logging
import boto3 
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):
    logger.info('printing event in testSaveUserPreferences')
    logger.info(event)
    # had to add ['body-json'] below when trying to call body from s3 hosted url
    userid = event['body-json']['userid']
    preferences = json.loads(event['body-json']['preferences'])
    preferenceString = '' 
    for p in preferences:
        preferenceString += (p+',')
    preferenceString = preferenceString.rstrip(",")
    print(preferenceString)
    client = boto3.client('dynamodb')
    response = client.put_item(
        TableName = os.environ['TABLE_NAME'], 
        Item = {
            'userid' : {"S" : userid},
            'preferences' : {"S" : preferenceString}
        }
    )
    
    print(response)
    print(userid)
    return {
        'statusCode': 200,
        'body': json.dumps('User preference updated successfully')
    }
