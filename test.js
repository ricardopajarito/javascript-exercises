describe('getTodoByID', () => {
	before(() => {
		sinon
			.stub(request, 'get')
			.yields(null, null, JSON.stringify({id:1}))
	})

	// after(() => {
	// 	request.get.restore();
	// });

	// it('todo has id of 1', (done) => {
	// 	index.getTODOById(1)
	// 		.then((todo) => {
	// 			expect(todo.id).to.equal(1);
	// 		})
	// 		.catch((err) => {
	// 			done(err);
	// 		});
	// });
})

var connection, sqlReqStub, sqlStubLib;
var server = require('./index.js')    
sqlStubLib = {};    
connection = new EventEmitter();    
connection.connected = true;    
connection.close = function() {};    
connection.connect = sinon.stub().callsArgWith(0, null);    
sqlStubLib.Connect = sinon.stub();    
sqlStubLib.Connection = function() {
  return connection;
};    
sqlReqStub = sinon.stub();    
sqlReqStub.input = function() {};    
sqlReqStub.execute = sinon.stub();    
sqlReqStub.execute.withArgs('sp_executesql').onFirstCall().callsArgWith(1, null, [
  [
  // js object 
  ]
], null, null);

sqlStubLib.Request = function() {
  return sqlReqStub;
};

server.sqlLib = sqlStubLib;

