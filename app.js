var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var alumnoRouter = require('./routes/alumno');
const padreRouter = require('./routes/padre');
const docenteRouter = require('./routes/docente');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
  secret: 'asdgsdo',
  resave: false,
  saveUninitialized: true
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Rutas 
 
app.get('/', function (req, res) {
	const conocido = Boolean(req.session.nombre);

	res.render('index',{
		title: 'Tipos de usuario',
		conocido: conocido,
		nombre: req.session.nombre,
    tipo: req.session.tipo
	});
});

app.post('/ingresar', function (req, res){
	if (req.body.nombre) {
		req.session.nombre = req.body.nombre
	}
	res.redirect('/');
});

app.get('/', function (req, res) {
  var tipo = Boolean(req.session.nombre);

	res.render('index',{
    nombre: req.session.nombre,
    tipo: req.session.tipo
	});
});

app.post('/tipo', function (req, res){
	if (req.body.alumno) {
    req.session.nombre = req.body.nombre
		res.redirect('/alumno');
	}
  if (req.body.padre) {
		res.redirect('/padre');
	}
  if (req.body.docente) {
		res.redirect('/docente');
	}
});


app.get('/fin', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});


app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/alumno', alumnoRouter);
app.use('/padre', padreRouter);
app.use('/docente', docenteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
