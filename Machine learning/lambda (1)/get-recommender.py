import json
import boto3 
import scipy
import csv 
import os 
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS



# endpoint = os.environ['ENDPOINT_NAME']
data_bucket = 'lambda-data-storage'
cl = boto3.client('sagemaker-runtime')


def lambda_handler(event, context):
    # TODO implement
    ingredients = event['Records'][0]['body']
    
    encoded_messages(ingredients)
    
    
    
    
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def encoded_messages(target_ingredients):
    s3 = boto3.resource('s3')
    obj = s3.Object(data_bucket, 'all_drinks.csv')
    data = obj.get()['Body'].read().decode('utf-8').splitlines()
    
    arr = np.loadtxt(f's3://lambda-data-storage/cocktail_features.csv', dtype = float, delimiter = ',')
    
  