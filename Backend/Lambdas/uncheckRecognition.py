import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    user_id = event['params']['querystring']['userid']
    #idx = user_id + ".png"
    #user_id = "mankar.karan@gmail.com"
    idx = user_id + ".png"
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('userpictable')
    response = table.delete_item(
    Key={
        'idx': idx
    }
    ) 
    print(response)

    return {
        'statusCode': 200,
        'body': json.dumps('Delete successful!')
    }
