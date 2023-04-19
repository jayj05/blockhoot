from node import Node

# Implementing leaderboard as priority queue
def LeaderBoard():
    def __init__(self):
        self.head = None 
    
    def isEmpty(self):
        return True if self.head == None else False
    
    def add(self, name, value):

        if self.isEmpty():
            self.head = Node(name, value)
            self.head.next = None
        else:
            if value > self.head.value:
                temp = self.head
                self.head = Node(name, value)
                self.head.next = temp 
            else:
                curr = self.head 
                while curr != None:
                    if value > curr.next.value:
                        break 
                    curr = curr.next 
                
                node = Node(name, value)
                node.next = curr.next 
                curr.next = node 
    
    def get(self):
        if self.isEmpty():
            return -1
        
        greatest_val = self.head
        self.head = self.head.next 
        return greatest_val