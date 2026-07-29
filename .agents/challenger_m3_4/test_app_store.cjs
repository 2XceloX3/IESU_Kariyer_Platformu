const path = require('path');
const { pathToFileURL } = require('url');

async function testAppStore() {
  const fileUrl = pathToFileURL(path.resolve(__dirname, '../../src/store/useAppStore.js')).href;
  const useAppStore = (await import(fileUrl)).default;

  console.log('--- TEST 1: Check addNotification behavior ---');
  const store = useAppStore.getState();
  console.log('Initial notifications:', store.notifications);
  console.log('Initial unread count:', store.unreadNotificationsCount);

  store.addNotification({ id: 'n1', title: 'New Notification' });

  const updatedStore = useAppStore.getState();
  console.log('Notifications after addNotification:', updatedStore.notifications);
  console.log('Unread count after addNotification:', updatedStore.unreadNotificationsCount);

  if (updatedStore.notifications.length === 0) {
    console.log('BUG CONFIRMED: addNotification key overwrite in useAppStore prevents adding notification objects to state.notifications array!');
  }

  console.log('\n--- TEST 2: Duplicate key liveRooms in useAppStore ---');
  console.log('liveRooms:', updatedStore.liveRooms);

  console.log('\n--- TEST 3: resetStore test ---');
  store.resetStore();
  const resetState = useAppStore.getState();
  console.log('State after resetStore - userRole:', resetState.userRole, 'viewState:', resetState.viewState);
}

testAppStore();
