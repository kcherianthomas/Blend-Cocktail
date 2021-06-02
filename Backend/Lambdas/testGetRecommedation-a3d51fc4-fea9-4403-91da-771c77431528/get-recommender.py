from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import scipy
import pickle
 
import boto3 
from requests_aws4auth import AWS4Auth
import requests
import json 
import csv 
import os  
from io import BytesIO


    
def lambda_handler(event, context):
    user_id = event['params']['querystring']['userid']    #TODO: currently hardcoding
    ingredients = id_to_ingredients(user_id)
    payload = encoded_messages(ingredients)
    cocktail_id_list = get_recommendation(payload)
    
    cocktail_thumbnails = [] 
    for id in cocktail_id_list: 
        cocktail_thumbnails.append(get_thumbnail(id))
    
    return {
        'statusCode': 200,
        'body': json.dumps(cocktail_thumbnails)
    }
    

 
def id_to_ingredients(user_id):
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['PREFERENCES_TABLE_NAME'])
    response = table.get_item(Key={'userid': user_id})
    if 'Item' in response:
        return response['Item']['preferences']
    return ""


def encoded_messages(ingredients):
    s3 = boto3.resource('s3')
    with BytesIO() as data:
        s3.Bucket(os.environ['BUCKET_NAME']).download_fileobj("vectorizer.pickle", data)
        data.seek(0)    
        vectorizer = pickle.load(data)
    
    raw = scipy.sparse.csr_matrix.toarray(vectorizer.transform([ingredients]))
    payload = (',').join([str(v) for v in raw.tolist()[0]])
    return payload 
    

def get_recommendation(payload):
    cl = boto3.client('sagemaker-runtime')
    response = cl.invoke_endpoint(
        EndpointName = os.environ['ENDPOINT_NAME'],
        ContentType='text/csv',
        Accept = 'application/json; verbose=true',
        Body = payload
    )
    
    result = json.loads(response['Body'].read().decode())
    ids = result['predictions'][0]['labels']
    return [str(int(id)) for id in ids]
    

def get_thumbnail(cocktail_id):
    
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, 'us-east-1', 'es', session_token=credentials.token)
    url = 'https://' + os.environ['ES_HOST_NAME'] + '/cocktails/_search'
    
    query = {
        "query": {"match": {"id": cocktail_id}},
    }

    headers = {"Content-Type": "application/json"}
    r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
    data = r.json()
    item = data['hits']['hits'][0]['_source']
    return {'id': item['id'], 'name': item['name'], 'imageSrc': item['image']}
