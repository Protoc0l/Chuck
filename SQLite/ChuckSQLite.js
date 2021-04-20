/*
 * ChuckSQLite.js
 * edited: simple wrapper around Max 5's JS support for SQLite databases.
 * originally by Tim Place, edited by Protoc0l March 2021
 * copyright © 2008-2021 Cycling '74
 */

var sqlite = new SQLite;
var result = new SQLResult;
outlets = 3;

function opendb(x)
{
    sqlite.open(x,1); //open a file-based DB
}


function closedb()
{
	sqlite.close();
}


function exec(arg)
{
	// execute the SQL statement in arg, returning results in the 'result' object
	sqlite.exec(arg, result);

	// access information about the returned records by calling functions on the result object
	formatResultForCellblock();
	
}

function getversion()
{
	post("SQLite Version: " + sqlite.getversion() + "\n");
}

function sqlout(arg)
{
	sqlite.exec(arg, result);
	var numfields = result.numfields();
    var numrecords = result.numrecords();
    var fieldnames = new Array(numfields);
    var values = new Array(numfields);

	for(var i=0; i<numfields; i++)
		outlet(2, result.fieldname(i));

	for(var i=0; i<numrecords; i++){
		for(var j=0; j<numfields; j++)
			outlet(1, result.value(j, i));
	}
}

function formatResultForCellblock()
{
    var numfields = result.numfields();
    var numrecords = result.numrecords();
    var fieldnames = new Array(numfields);
    var values = new Array(numfields);

	outlet(0, "clear", "all");
	outlet(0, "cols", numfields);
	outlet(0, "rows", numrecords + 1);    // rows +1 so we can create a header row

	for(var i=0; i<numfields; i++)
		outlet(0, "set", i, 0, result.fieldname(i));

	for(var i=0; i<numrecords; i++){
		for(var j=0; j<numfields; j++)
			outlet(0, "set", j, i+1, result.value(j, i));
	}

}