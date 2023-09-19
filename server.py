from flask import Flask, request, redirect, url_for, render_template, session
from flask_socketio import SocketIO, send, join_room, leave_room, emit
from leaderBoard import LeaderBoard
import random 
from string import ascii_uppercase

app = Flask(__name__)
app.secret_key = "h1idji3nh2ijh1ij3ijfnu38h9rh943hfvu9rj3"
socketio = SocketIO(app) 
code_characters = '0123456789' + ascii_uppercase

rooms = {} 
score_track = {}
leaderboard_sort = LeaderBoard()
final_leaderboard = []

def generate_unique_code(length):
    generating = True
    while generating:
        code = ""
        for _ in range(length):
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
    return render_template('game.html')

@app.route("/podium")
def podium():
    return render_template('podium.html')
# when the room page is rendered
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
    emit('newPlayer', {'name': name, 'memberCount': rooms[room]['memberCount']}, to=room)
    
# Delete them from the current members of room, 
# then send to server new current members
@socketio.on('disconnect')
def disconnect():
    room = session.get("room")
    members = rooms[room]['members']
    rooms[room]['memberCount'] -= 1
    for member, sid in members.items():
        # Removing by sid, just in case two players have the same name
        if request.sid == sid:
            members.pop(member)
            break
    # Updating the real time feed of the active players 
    leave_room(room)
    emit('removePlayer', rooms[room]['members'], to=room)

@socketio.on("start_game")
def start_game():
    is_host = session.get("HOST", False)
    room = session.get('room')
    
    if is_host:
        emit('start_game', to=room)

@socketio.on("initGameLoad")
def init_leaderboard():
    room = session.get('room')
    final_leaderboard = []
    leaderboard = []

    for member in rooms[room]['members']:
        score_track[member] = 0
    
    for member, score in score_track.items():
        leaderboard_sort.add(member, score)

    while not leaderboard_sort.isEmpty():
        player = leaderboard_sort.get()
        leaderboard.append({'name': player.name, 'score': player.score})
    emit('updateLeaderboard', leaderboard, to=room)   

@socketio.on("updateScore")
def update_score(data):
    name = session.get("name")
    room = session.get("room")

    score_track[name] = data 

    leaderboard = []

    for member, score in score_track.items():
        leaderboard_sort.add(member, score)
    
    while not leaderboard_sort.isEmpty():
        player = leaderboard_sort.get()
        leaderboard.append({'name': player.name, 'score' : player.score})
    
    emit("updateLeaderboard", leaderboard, to=room)

@socketio.on("podiumData")
def podium_data():
    room = session.get("room"); 
    print(final_leaderboard)
    emit("renderPodium", final_leaderboard, to=room)

@socketio.on("endGame")
def end_game():
    print("game ending")
    room = session.get("room")

    for member, score in score_track.items():
        leaderboard_sort.add(member, score)
    
    while not leaderboard_sort.isEmpty():
        player = leaderboard_sort.get()
        final_leaderboard.append({'name' : player.name, 'score' : player.score})
    
    emit("endGame", to=room)
@socketio.on("refreshPage")
def refresh_page():
    if session.get("HOST", False):
        rooms.clear()
        emit("goHome")

if __name__ == "__main__":
    socketio.run(app, allow_unsafe_werkzeug=True)