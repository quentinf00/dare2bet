import boto3
import json


def run(event, context):

    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
    }

    return {
        'headers': response_headers,
        'statusCode': 200,
        "body": json.dumps({
            "question": "Do you want to drink",
            "answers": ['yes', 'no']
        })
    }
