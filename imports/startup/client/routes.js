import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/admin/words-show-page.js';

FlowRouter.route('/admin/words', {
  name: 'Admin.words',
  action() {
    BlazeLayout.render('App_body', { main: 'Words_show_page' });
  },
});