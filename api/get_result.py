import boto3
import json


def run(event, context):

    s3 = boto3.client('s3')
    state = load_state(s3)
    answers = state.get('answers', {})
    players = state.get('players', [])

    done = True
    responded = []
    waiting_for_response = []
    for player in players:
        if player in answers:
            responded.append(player)
        else:
            done = False
            waiting_for_response.append(player)

    if not done:
        result = {
            'everybody_answered': done,
            'already_responded': responded,
            'waiting_for_response': waiting_for_response
            }
    else:
        result = {
            'should_drink': responded,
            'should_not_drink': []
            }
        del state['answers']
        dump_state(s3, state)

    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
    }

    return {
        'headers': response_headers,
        'statusCode': 200,
        "body": json.dumps(result)
    }


def load_state(s3):

    bucket_content = s3.list_objects_v2(Bucket='dare-to-bet-state-store')
    print(f"Bucket content {[item['Key'] for item in bucket_content.get('Contents', [])]}")
    if 'state.json' in [item['Key'] for item in bucket_content.get('Contents', [])]:
        print('loading existing state')

        with open('/tmp/state.json', 'wb') as data:
            s3.download_fileobj('dare-to-bet-state-store', 'state.json', data)

        with open('/tmp/state.json', 'r') as data:
            state = json.load(data)
            print(f'Loading state: {state}')
            return state
    else:
        print('Initiating state')
        return {}


def dump_state(s3, state):
    print(f'Dumping state: {state}')
    with open('/tmp/state.json', 'w') as data:
        json.dump(state, data)

    with open('/tmp/state.json', 'rb') as data:
        s3.upload_fileobj(data, 'dare-to-bet-state-store', 'state.json')
