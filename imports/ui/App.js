import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from "../db/TasksCollection.js";
import './App.html';
import './Task.js';
import "./Login.js";

const IS_LOADING_STRING = "isLoading";
const HIDE_COMPLETED_STRING = "hideCompleted";
const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
}

Template.mainContainer.helpers({
  async tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return await TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetchAsync();
  },
  async incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = await TasksCollection.find(
      pendingOnlyFilter
    ).countAsync();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  }
});

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  "click .user"() {
    Meteor.logout();
  }
});

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  const handler = Meteor.subscribe('tasks');
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());
  });
});

Template.form.events({
  "submit .task-form"(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);

    target.text.value = '';
  }
})
