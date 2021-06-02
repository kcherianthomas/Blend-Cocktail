import json
import boto3
import base64
import logging
from botocore.exceptions import ClientError

s3 = boto3.client('s3')
rekClient = boto3.client('rekognition')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("printing testauthenticatepics")
    logger.info(event)
    # you can assume u get a base 64 image from ui and a user id as post request
    pic = event['body-json']['userimage']
    idx = event['body-json']['userid'] + ".png"
    out = "Unmatched"
    dec = base64.b64decode(pic + "===")
        
    sourceFile = dec
    
    try:
        response=rekClient.compare_faces(SimilarityThreshold=80,
                                  SourceImage={'Bytes': sourceFile},
                                  TargetImage={'S3Object': {'Bucket': 'userpicbucket','Name':idx}})
                                  
        logger.info(response)
        
        if response['FaceMatches']:
            for faceMatch in response['FaceMatches']:
                position = faceMatch['Face']['BoundingBox']
                similarity = str(faceMatch['Similarity'])
                result = 'The face at ' + str(position['Left']) + ' ' + str(position['Top']) + ' matches with ' + similarity + '% confidence'
        else:
            out = "Unmatched"
            result = "Unmatched"
            similarity = 0.

        logger.info(result)
        
        if float(similarity)>=90.0:
            out = "Matched"
            
        # if matched send Matched
        return {
            'statusCode': 200,
            'body': json.dumps(out)}
    except ClientError as e:
       return {
        'statusCode': 200,
        'body': json.dumps('out')}
    
    
