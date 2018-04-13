import add_player
from unittest.mock import patch

@patch('add_player.load_state', lambda x: {})
@patch('add_player.boto3.client', lambda x: 's3')
@patch('add_player.dump_state')
def test_run(dump_state_mock):
    add_player.run({'queryStringParameters': {'player_name': 'toto'}}, None)
    dump_state_mock.assert_called_with('s3', {'players': ['toto']})


@patch('add_player.load_state', lambda x: {'players': ['toto']})
@patch('add_player.boto3.client', lambda x: 's3')
@patch('add_player.dump_state')
def test_run_exist(dump_state_mock):
    add_player.run({'queryStringParameters': {'player_name': 'toto'}}, None)
    dump_state_mock.assert_called_with('s3', {'players': ['toto']})