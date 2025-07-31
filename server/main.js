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
  const existingUser = await Accounts.findUserByUsername(SEED_USERNAME);
  if (!existingUser) {
    console.log(`Creating user: ${SEED_USERNAME}`);
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    console.log(`User created: ${SEED_USERNAME}`);
  } else {
    console.log(`User already exists: ${existingUser.username}`);
  }

  const user = await Accounts.findUserByUsername(SEED_USERNAME);

  if (await TasksCollection.find().countAsync() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(async taskText => insertTask(taskText, await user));
  }
});