import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # This function is used to check if for a perticular user id we need to face authentication
    # userid
    user_id = event['params']['querystring']['userid']
    #user_id = "mankar.karan@gmail.com"
    idx = user_id + ".png"
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('userpictable')
    try:
        response = table.get_item(Key={'idx': idx})
        print(response)
        if 'Item' in response.keys():
            return {
                'statusCode': 200,
                'body': json.dumps('Required')
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps('not required')
            }
        
    except ClientError as e:
       return {
        'statusCode': 400,
        'body': json.dumps('error')
    }
    
