from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId  # Correct import for ObjectId

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/crudapp'
mongo = PyMongo(app)

CORS(app)

db = mongo.db  # Access the database

# Create a new user (with duplication check)
@app.route("/users", methods=["POST"])
def create_user():
    users_data = request.json  # This will be a list of users
    inserted_ids = []  # List to store inserted ids

    if not isinstance(users_data, list):  # Ensure input is a list
        return jsonify({'msg': 'Input data should be a list of users'}), 400
    
    for user in users_data:  # Loop through the list
        # Check if user already exists
        existing_user = db.users.find_one({
            'email': user.get('email')  # Check uniqueness by email
        })
        
        if not existing_user:  # If the user doesn't exist, insert new user
            # Validate required fields
            if not all(key in user for key in ['name', 'email', 'contact', 'address']):
                return jsonify({'msg': 'Missing required fields'}), 400

            # Insert new user
            id = db.users.insert_one({
                'name': user['name'],
                'email': user['email'],
                'contact': user['contact'],
                'address': user['address'],
            }).inserted_id  # Use `inserted_id` to get the ID of the inserted document

            inserted_ids.append(str(id))  # Collect the inserted ids
        else:
            inserted_ids.append(str(existing_user['_id']))  # Append existing user's ID

    return jsonify({'ids': inserted_ids, 'msg': "Users Added Successfully"}), 201

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = []  # Initialize an empty list to hold users
    for doc in db.users.find():  # Ensure you are querying the correct collection
        users.append({
            '_id': str(doc['_id']),  # Convert ObjectId to string
            'name': doc['name'],
            'email': doc['email'],
            'contact': doc['contact'],
            'address': doc['address'],
        })
    return jsonify(users)  # Return all users after the loop finishes

# Get a single user by ID
@app.route('/users/<id>', methods=['GET'])
def get_user(id):
    try:
        user = db.users.find_one({'_id': ObjectId(id)})  # Specify the collection
        if user:
            return jsonify({
                '_id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'contact': user['contact'],
                'address': user['address'],
            })
        else:
            return jsonify({'msg': f'User with id {id} not found'}), 404
    except Exception as e:
        return jsonify({'msg': 'Invalid user ID format'}), 400

# Delete a user by ID
@app.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        result = db.users.delete_one({'_id': ObjectId(id)})  # Accessing the 'users' collection
        if result.deleted_count > 0:  # Checking if any document was deleted
            return jsonify({'msg': "User Deleted Successfully"})
        else:
            return jsonify({'msg': f'User with id {id} not found'}), 404
    except Exception as e:
        return jsonify({'msg': 'Invalid user ID format'}), 400

@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    # Get the updated user data from the request body
    user = request.get_json()  # This ensures you're properly getting the data from the body

    if not user:
        return jsonify({'msg': 'No data provided'}), 400  # Handle case where no data is provided

    # Ensure the required fields are in the request body
    if not all(key in user for key in ['name', 'email', 'contact', 'address']):
        return jsonify({'msg': 'Missing required fields'}), 400

    try:
        # Update the user data in the database
        result = db.users.update_one(
            {'_id': ObjectId(id)},  # Query to match the user by ID
            {'$set': {  # Update fields using the $set operator
                'name': user['name'],
                'email': user['email'],
                'contact': user['contact'],
                'address': user['address']
            }}
        )

        if result.modified_count > 0:
            return jsonify({'msg': "User Updated Successfully"})
        else:
            return jsonify({'msg': f'User with id {id} not found or no changes made'}), 404
    except Exception as e:
        return jsonify({'msg': 'Invalid user ID format'}), 400

if __name__ == "__main__":
    app.run(debug=True)