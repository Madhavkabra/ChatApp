import { db } from '../firebase';

const chatRoomRef = db.collection('org').doc('chat').collection('chatRoom');

export const createRoom = async (users, createdBy, name, type) => {
  try {
    const chatRoom = {
      createdAt: new Date(),
      createdBy,
      members: users,
      name,
      type,
    };

    return new Promise((resolve, reject) => {
      chatRoomRef
        .add(chatRoom)
        .then(function (docRef) {
          resolve(docRef);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  } catch (err) {
    // snackbar(err?.message, 'error');
    return false;
  }
};

export const fetchChatRoomByUserID = async (userId) => {
  return new Promise((resolve, reject) => {
    try {
      chatRoomRef
        .where('members', 'array-contains', userId)
        .onSnapshot((querySnapshot) => {
          const chatRooms = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            if (data.recentMessage) chatRooms.push(data);
          });
          resolve(chatRooms);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const fetchChatRoomByIds = (chatRoomIds) => {
  const chatRoom = [];
  return new Promise((resolve, reject) => {
    chatRoomIds.forEach(async (chatRoomId) => {
      await chatRoomRef
        .get(chatRoomId)
        .then(function (doc) {
          chatRoom.push(doc.data());
        })
        .catch(function (error) {
          console.error('Error get document: ', error);
        });
    });
    resolve(chatRoom);
  });
};

export const updateChatRoom = (chatRoom) => {
  return new Promise((resolve, reject) => {
    chatRoomRef
      .doc(chatRoom.id)
      .set(chatRoom)
      .then(function (docRef) {
        resolve(docRef);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const addUserToChatRoom = (user, chatRoomId) => {
  try {
    const chatRooms = user?.chatRoom || [];
    const isExistChatRoom = chatRooms.includes(chatRoomId);
    if (!isExistChatRoom) {
      chatRooms.push(chatRoomId);
      user.chatRoom = chatRooms;
      const userRef = db.collection('user');
      userRef.doc(user.uid).set(user);
    }
  } catch (error) { }
};
