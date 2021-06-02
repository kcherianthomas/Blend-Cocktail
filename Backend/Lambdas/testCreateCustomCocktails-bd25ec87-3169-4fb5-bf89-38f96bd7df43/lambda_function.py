import json
import logging
from elasticsearch import Elasticsearch, RequestsHttpConnection
import boto3
import base64
import datetime
from requests_aws4auth import AWS4Auth
from elasticsearch import Elasticsearch, RequestsHttpConnection
import os
import time

s3 = boto3.client('s3')
s3url = 'https://photoscustomcocktail.s3.amazonaws.com/'

logger = logging.getLogger()
logger.setLevel(logging.INFO)
def lambda_handler(event, context):
    logger.info("printing testCreateCustomCocktails")
    #logger.info(event)
    body = event['body-json']
    customcoktailname = body['customcoktailname'].strip()
    customcoktailcategory = body['customcoktailcategory'].strip()
    customcoktailtype = body['customcoktailtype'].strip()
    customcoktailglasstype = body['customcoktailglasstype'].strip()
    customcoktailmeasurement = body['customcoktailmeasurement'].rstrip(",").strip()
    customcoktailingredient = body['customcoktailingredient'].rstrip(",").strip()
    customcoktailinstruction = body['customcoktailinstruction'].strip()
    id = round(time.time())
    imagebody = body['imagebody']
    imagename = str(id)+body['imagename']
    print(imagename)
    #decoding base64 and adding it to s3
    s3.put_object(Bucket='photoscustomcocktail', Key=imagename, Body=base64.b64decode(imagebody))
    imagesrc = s3url+imagename
    #generating custom cocktail id
    customcocktailid = "c"+customcoktailname.replace(" ", "")+str(id)
    print(customcocktailid)
    #elastic search
    payloadForEs = {'id': customcocktailid, 'name': customcoktailname, 'image': imagesrc, 'ingredients': customcoktailingredient.split(",")}
    host = 'search-cocktail-recommender-lgzf4jx4wlile4ytkmcftgi6yi.us-east-1.es.amazonaws.com'
    region = 'us-east-1'

    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    es = Elasticsearch(
    hosts=[{'host': host, 'port': 443}],
    http_auth=awsauth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
    timeout=30
    )
    print(es.ping())
    print(es.info())
    print(payloadForEs)
    es.index(index='cocktails', doc_type="_doc", body=payloadForEs)
    
    #dynamo db
    payloadForDB = {
    'id': {"S" : customcocktailid}, 
    'strDrink': {"S" : customcoktailname}, 
    'strInstructions': {"S" : customcoktailinstruction},
    'strGlass': {"S": customcoktailglasstype},
    'measures': {"S" : customcoktailmeasurement}, 
    'ingredients': {"S" : customcoktailingredient},
    'strCategory' : {"S" : customcoktailcategory},
    'strAlcoholic' : {"S" : customcoktailtype},
    'strDrinkThumb':{"S" : imagesrc}
    }
    client = boto3.client('dynamodb')
    print(payloadForDB)
    logger.info(payloadForDB)
    response = client.put_item(TableName = os.environ['TABLE_NAME'], Item = payloadForDB)
    #print(response)
    
    # add a lex call to save ingredient
    ingredient_set = set()
    client = boto3.client('lex-models')
    r = customcoktailingredient.split(",")
    #adding the custom ingredient names
    for el in r:
        ingredient_set.add(el)
        
    response = client.get_slot_type(
        name = 'cocktailIngredientsTwo',
        version='$LATEST'
    )
    
    for el in response['enumerationValues']:
        #print(el['value'])
        ingredient_set.add(el['value'])
        
    r = []
    for v in ingredient_set:
        r.append({'value': v})
        
    checksum = response['checksum']
    
    response = client.put_slot_type(
        name = 'cocktailIngredientsTwo',
        enumerationValues = r,
        checksum = checksum
    )
    
     # Lex call to add cocktail names to slot
    cocktailnames_set = set()
    response = client.get_slot_type(
        name = 'cocktailNamesTwo',
        version='$LATEST'
    )
    
    for el in response['enumerationValues']:
        cocktailnames_set.add(el['value'])
        
    cocktailnames_set.add(customcoktailname)
        
    r = []
    for v in cocktailnames_set:
        r.append({'value': v})
        
    checksum = response['checksum'] 
    
    response = client.put_slot_type(
        name = 'cocktailNamesTwo',
        enumerationValues = r,
        checksum = checksum
    )
    
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Custom cocktail created successfully')
    }
