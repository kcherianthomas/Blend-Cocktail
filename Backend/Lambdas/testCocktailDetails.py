import json
import boto3 
import os
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info('printing event in testCocktailDetails')
    logger.info(event)
    client = boto3.resource('dynamodb')
    table = client.Table(os.environ['TABLE_NAME'])
    id = event['params']['querystring']['cocktailid']
    response = table.get_item(Key={'id': id})
    print(response['Item'])
    detailMap = response['Item']
    ingredientsList = detailMap['ingredients'].split(",")
    measurementList = detailMap['measures'].split(",") 
    ingredientAndMeasurementList = []
    for i in range(0,len(measurementList)):
        ingredientAndMeasurementList.append(measurementList[i]+" "+ingredientsList[i])
    print(ingredientAndMeasurementList)
    # removing space in front of each instruction at front end
    instructionList = detailMap['strInstructions'].strip().rstrip(".").split(".")
    print(instructionList)
    
    details = {
    'id': id,
    'name': detailMap['strDrink'],
    'category': detailMap['strCategory'],
    'type': detailMap['strAlcoholic'],
    'glassType': detailMap['strGlass'],
    'ingredientAndMeasurement':ingredientAndMeasurementList,
    'instructuion':instructionList,
    'imageSrc': detailMap['strDrinkThumb']
    }
    return {
        'statusCode': 200,
        'body': json.dumps(details)
    }
