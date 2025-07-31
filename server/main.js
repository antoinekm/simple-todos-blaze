import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const insertTask = async (taskText, user) =>
  await TasksCollection.insertAsync({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(async () => {
  let user = await Accounts.findUserByUsername(SEED_USERNAME);
  
  if (!user) {
    console.log(`Creating user: ${SEED_USERNAME}`);
    const userId = await Accounts.createUserAsync({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    console.log(`User created: ${SEED_USERNAME}`);
    user = await Meteor.users.findOneAsync(userId);
  } else {
    console.log(`User already exists: ${user.username}`);
  }

  if (await TasksCollection.find().countAsync() === 0) {
    const tasks = [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ];
    
    for (const taskText of tasks) {
      await insertTask(taskText, user);
    }
  }
});