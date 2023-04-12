from flask import Flask, request, redirect, url_for, render_template, session
from flask_socketio import SocketIO, send, join_room, leave_room, emit
import random 
from string import ascii_uppercase

app = Flask(__name__)
app.secret_key = "h1idji3nh2ijh1ij3ijfnu38h9rh943hfvu9rj3"
socketio = SocketIO(app) 
code_characters = '0123456789' + ascii_uppercase

rooms = {}   

def generate_unique_code(length):
    generating = True
    while generating:
        code = ""
        for i in range(length):
            code += random.choice(code_characters)

        if code not in rooms:
            generating = False
    
    return code

@app.route("/", methods=["POST", "GET"])
def home():
    session.clear()
    if request.method == "POST":
        name = request.form.get("name")
        code = request.form.get("joinCode")
        join = request.form.get("join", False)
        create = request.form.get("create", False)
        
        # \\Add error messages to home page//

        if not name:
            return render_template('home.html')
        
        # If they clicked join, but do not have a code
        if join != False and not code:
            return render_template('home.html')
        
        room = code

        if create != False:
            room = generate_unique_code(6)
            # 'members' is a dictionary of all the active members of the room
            rooms[room] = {'memberCount': 0, 'members': {}}
            # Enable host priveliges
            session["HOST"] = True
        elif code not in rooms:
            return render_template('home.html')
        
        # Once all checks are passed, session data is stored
        session["name"] = name 
        session["room"] = room

        # Redirect them to room page, where the socket will be initalized
        return redirect(url_for('room'))
    return render_template('home.html')

@app.route("/room")
def room():
    name = session.get("name")
    room = session.get("room")
    if not name or not room or room not in rooms:
        return render_template('home.html')
    
    return render_template('room.html', code=room, members=rooms[room]['members'])

@app.route("/game")
def game():
    room = session.get("room")
    return render_template('game.html')

@socketio.on('connect')
def connect(data):
    name = session.get("name")
    room = session.get("room")

    # We are going to send them to their room
    join_room(room)
    rooms[room]['memberCount'] += 1

    # Store their name with their session id in a dictionary
    rooms[room]['members'][name] = request.sid
    print(rooms[room]['members'])

    # Updating the active players
    emit('newPlayer', {'name': name}, to=room)

# Delete them from the current members of room, 
# then send to server new current members
@socketio.on('disconnect')
def disconnect():
    room = session.get("room")
    members = rooms[room]['members']
    for member, sid in members.items():
        # Removing by sid, just in case two players have the same name
        if request.sid == sid:
            members.pop(member)
            break
        
    # Updating the real time feed of the active players 
    emit('removePlayer', rooms[room]['members'], to=room)

@socketio.on("start_game")
def start_game():
    is_host = session.get("HOST", False)
    room = session.get('room')

    if is_host:
        emit('start_game', to=room, start=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)