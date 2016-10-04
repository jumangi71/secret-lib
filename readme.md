## How to start

1) Install sails nodejs framework as global

```bash
$ cd secret-lib
$ sudo npm -g install sails
```
2) Install all dependencies

```bash
$ cd api
$ npm i
```

3) Run web server

```bash
$ sails lift
```

4) Go to [localhost:1337](http://localhost:1337/)

Enjoy!


p.s.

```
User.findOne({id: <UID>}).exec(function(err, user) {user.roles.add(<ROLE ID>); user.save();});
User.findOne({id: <UID>}).populateAll().exec(console.log);
```