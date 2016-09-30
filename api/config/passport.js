var passport = require('passport'),
  LdapStrategy = require('passport-ldapauth');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LdapStrategy({
  server: {
    url: 'ldap://ldcro.rambler.ramblermedia.com:389',
    bindDn: "ldap.library",
    bindCredentials: "PZKFsS45M3ctYKb",
    searchBase: "ou=company,dc=rambler,dc=ramblermedia,dc=com",
    searchFilter: "(&(objectcategory=person)(objectclass=user)(|(samaccountname={{username}})(mail={{username}})))",
    searchAttributes: ["cn", "uid", "id", "ruid", "displayName", "mail", "givenname", "enabled", "role", "projects"]
  }
}));
