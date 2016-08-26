import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/admin/words-show-page.js';
import '../../ui/pages/admin/sentences-show-page.js';
import '../../ui/pages/admin/collections-show-page.js';
import '../../ui/pages/user/learn-page.js';

FlowRouter.route('/admin/words', {
  name: 'Admin.words',
  action() {
    BlazeLayout.render('App_body', { main: 'Words_show_page' });
  },
});

FlowRouter.route('/admin/sentences', {
  name: 'Admin.sentences',
  action() {
    BlazeLayout.render('App_body', { main: 'Sentences_show_page' });
  },
});

FlowRouter.route('/admin/collections', {
  name: 'Admin.collections',
  action() {
    BlazeLayout.render('App_body', { main: 'Collections_show_page' });
  },
});

FlowRouter.route('/user/learn', {
  name: 'User.learn',
  action() {
    BlazeLayout.render('App_body', { main: 'Learn_page' });
  },
});