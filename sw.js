// Background Service Worker (sw.js)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || '🚨 Motion Detected!';
  const options = {
    body: data.message || 'New recording.',
    icon: 'https://cdn-icons-png.flaticon.com/512/1179/1179120.png', // Default camera icon
    badge: 'https://cdn-icons-png.flaticon.com/512/1179/1179120.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'motion-alert',
    renotify: true,
    data: { url: self.registration.scope } // URL to open on click
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Click event: Bring browser window/tab back to front
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If tab is already open, focus it
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

