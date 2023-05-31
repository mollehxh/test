// const express = require('express');
// const path = require('path');

// const PORT = 3000;

// const app = express();

// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('visum', 'root', 'root', {
//   host: 'localhost',
//   port: 3306,
//   dialect: 'mysql',
// });

// const User = sequelize.define('User', {
//   user_id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   username: {
//     type: Sequelize.STRING,
//   },
//   email: {
//     type: Sequelize.STRING,
//     unique: true,
//     allowNull: false,
//     validate: {
//       isEmail: true,
//     },
//   },
//   avatar: {
//     type: Sequelize.TEXT('long'),
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

// sequelize.sync();

// console.log('SEEEEQUEEEELIZEEEEE', !!sequelize);

// (async () => {
//   const data = await User.findAll();
//   console.log(data);
// })();

// app.get('/jo', async (req, res) => {
//   const data = await User.findAll();
//   console.log(data);
//   res.send('hello');
// });

// app.listen(PORT);

// APPLICATION

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// модели

const Sequelize = require('sequelize');
const sequelize = new Sequelize('visum', 'root', 'root', {
  host: 'mysql',
  port: 3306,
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  avatar: {
    type: Sequelize.TEXT('long'),
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Room = sequelize.define('Room', {
  room_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  creator_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  video_url: {
    type: Sequelize.STRING,
  },
  preview: {
    type: Sequelize.TEXT('long'),
  },
  title: {
    type: Sequelize.STRING,
  },
});

const RoomMember = sequelize.define('RoomMember', {
  member_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Room,
      key: 'room_id',
    },
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
});

const Message = sequelize.define('Message', {
  message_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  message_text: {
    type: Sequelize.STRING,
  },
  timestamp: {
    type: Sequelize.DATE,
  },
});

const RoomMessage = sequelize.define('RoomMessage', {
  room_message_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Room,
      key: 'room_id',
    },
  },
  message_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Message,
      key: 'message_id',
    },
  },
});

User.hasMany(Room, { foreignKey: 'creator_id', as: 'createdRooms' });
Room.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
Room.belongsToMany(User, {
  through: RoomMember,
  foreignKey: 'room_id',
  as: 'members',
});
User.belongsToMany(Room, {
  through: RoomMember,
  foreignKey: 'user_id',
  as: 'joinedRooms',
});
Room.hasMany(RoomMessage, { foreignKey: 'room_id' });
RoomMessage.belongsTo(Room, { foreignKey: 'room_id' });
User.hasMany(Message, { foreignKey: 'user_id' });
Message.belongsTo(User, { foreignKey: 'user_id' });
Message.hasOne(RoomMessage, { foreignKey: 'message_id' });
RoomMessage.belongsTo(Message, { foreignKey: 'message_id' });

sequelize.sync();

// контроллеры

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatar = `https://api.dicebear.com/6.x/identicon/svg?seed=${email}&backgroundColor=ffdfbf,ffd5dc,c0aede`;

    const user = await User.create({
      username,
      email,
      avatar,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.user_id }, 'secretKey');

    res.status(201).json(user.email);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.user_id }, 'secretKey');

    res.status(201).json(user.email);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSession = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send();
    }

    const formattedUser = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    res.send(formattedUser);
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).send('Произошла ошибка при получении пользователя');
  }
};

const createRoom = async (req, res) => {
  try {
    const videoDetails = await getVideoDetails(req.body.video_url);
    const room = await Room.create({
      creator_id: req.body.creator_id,
      video_url: req.body.video_url,
      preview: videoDetails.preview,
      title: videoDetails.title,
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'creator',
        },
      ],
      attributes: ['room_id', 'video_url', 'preview', 'title'],
    });

    const formattedRooms = rooms.map((room) => ({
      roomId: room.room_id,
      creator: {
        username: room.creator ? room.creator.username : null,
      },
      preview: room.preview,
      title: room.title,
      videoUrl: room.video_url,
    }));

    res.status(200).json(formattedRooms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getVideoUrl = async (req, res) => {
  try {
    const room = await Room.findOne({
      include: [
        {
          model: User,
          attributes: ['username'],
          as: 'creator',
        },
      ],
      where: {
        room_id: req.body.roomId,
      },
      attributes: ['video_url'],
    });

    res.status(200).json(room.video_url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRoomMember = async (req, res) => {
  try {
    const roomMember = await RoomMember.create(req.body);
    res.status(201).json(roomMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRoomMessage = async (message, roomId) => {
  try {
    const roomMessage = await RoomMessage.create({
      room_id: roomId,
      message_id: message.message_id,
    });
    return roomMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    const roomMessage = await createRoomMessage(message, req.body.room_id); // Создаем связь между сообщением и комнатой
    res.status(201).json({ message, roomMessage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllRoomMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const roomMessages = await RoomMessage.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: Message,
          include: [{ model: User, attributes: ['username', 'avatar'] }],
          attributes: ['message_id', 'message_text'],
        },
      ],
      attributes: ['createdAt'],
    });

    const messages = roomMessages.map((roomMessage) => ({
      messageId: roomMessage.Message.message_id,
      username: roomMessage.Message.User.username,
      avatar: roomMessage.Message.User.avatar,
      text: roomMessage.Message.message_text,
    }));

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsersInRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const users = await User.findAll({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: Room,
          as: 'joinedRooms',
          through: {
            attributes: [],
          },
          where: { room_id: roomId },
          attributes: [],
        },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const express = require('express');
const router = express.Router();

router.post('/api/users', createUser);
router.post('/api/users/login', loginUser);
router.post('/api/session', getSession);
router.post('/api/rooms', createRoom);
router.get('/api/rooms', getAllRooms);
router.post('/api/room-members', createRoomMember);
router.post('/api/get-url', getVideoUrl);
router.post('/api/messages', createMessage);
router.post('/api/room-messages', createRoomMessage);
router.get('/api/rooms/:roomId/messages', getAllRoomMessages);
router.get('/api/rooms/:roomId/users', getUsersInRoom);

const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const http = require('http');
const { default: axios } = require('axios');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = 3000;

app.use(cors());
app.use(express.json());

// роутер
app.use(router);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

roomUsers = new Map();

// Обработка сокетов
io.on('connection', (socket) => {
  roomUsers.set(socket.id, {});

  // Поключение к комнате
  socket.on('joinRoom', async ({ roomId, userId }) => {
    roomUsers.get(socket.id).roomId = roomId;
    roomUsers.get(socket.id).userId = userId;
    // Создание участника комноты
    try {
      const roomMember = await RoomMember.create({
        room_id: roomId,
        user_id: userId,
      });
      socket.join(roomUsers.get(socket.id).roomId);
    } catch (error) {
      console.error(error);
    }
  });

  // Отправка сообщения
  socket.on('sendMessage', async ({ roomId, userId, message }) => {
    try {
      // создание сообщения
      const createdMessage = await Message.create({
        user_id: userId,
        message_text: message,
      });

      // создание сообщения в комнате
      await createRoomMessage(createdMessage, roomId);

      // получение пользователя для связи
      const user = await User.findByPk(userId);

      // отпралвение нового сообщения всем пользователям в сокете
      io.to(roomId).emit('message', {
        messageId: createdMessage.message_id,
        username: user.username,
        avatar: user.avatar,
        text: createdMessage.message_text,
        createdAt: createdMessage.createdAt,
      });
    } catch (error) {
      console.error(error);
    }
  });

  // обработка запуска видео
  socket.on('playVideo', (seconds) => {
    const room = roomUsers.get(socket.id).roomId;
    if (room) {
      socket.broadcast
        .to(roomUsers.get(socket.id).roomId)
        .emit('playVideo', seconds);
    }
  });

  // обработка остановки видео
  socket.on('pauseVideo', (seconds) => {
    const room = roomUsers.get(socket.id).roomId;
    if (room) {
      socket.broadcast
        .to(roomUsers.get(socket.id).roomId)
        .emit('pauseVideo', seconds);
    }
  });

  // обработка перемотки видео
  socket.on('seekVideo', (time) => {
    const room = roomUsers.get(socket.id).roomId;
    if (room) {
      socket.broadcast.to(room).emit('seekVideo', time);
    }
  });

  // Отключение от сокета
  socket.on('disconnect', async () => {
    try {
      await RoomMember.destroy({
        where: {
          room_id: roomUsers.get(socket.id).roomId,
          user_id: roomUsers.get(socket.id).userId,
        },
      });
      socket.leave(roomUsers.get(socket.id).roomId);

      roomUsers.delete(socket.id);
    } catch (error) {
      console.error(error);
    }
  });
});

// Запуск сервера
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function getVideoDetails(videoId) {
  const apiKey = 'AIzaSyD2QZAqw5Gf-5t5WYne94Sriy_TmNDUBv0';
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const { title, thumbnails } = data.items[0].snippet;

    const preview = thumbnails.standard?.url || thumbnails.default.url;

    return { title, preview };
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return null;
  }
}
