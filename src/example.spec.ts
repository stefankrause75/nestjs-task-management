class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend!`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if (idx === -1) {
      throw new Error('friend not found');
    }
    this.friends.splice(idx);
  }
}

describe('FriendsList', () => {
  let friendsList: FriendsList;
  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('initialies friends list', () => {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('add a friend to the  list', () => {
    friendsList.addFriend('Joe');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announces friendships', () => {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Joe');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Joe');
  });

  describe('remove a friend', () => {
    it('removes a friend from a list', () => {
      friendsList.addFriend('Joe');
      friendsList.addFriend('Andy');
      expect(friendsList.friends[1]).toEqual('Andy');
      friendsList.removeFriend('Andy');
      expect(friendsList.friends[0]).toEqual('Joe');
      expect(friendsList.friends.length).toEqual(1);
    });
    it('throws for a non existing friend', () => {
      expect(() => friendsList.removeFriend('Matthew')).toThrow(Error);
    });
  });
});
