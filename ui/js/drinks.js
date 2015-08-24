var drink_data = {};
var dispenser_data = {};
var drink_selected = undefined;
$.ajax({
  url: 'js/drinks.json',
  success: function(data) {
  	console.log('test1' , data);
  	var drinks = data.drinks;
  	dispenser_data = data.dispensers;
  	for (var i = 0 ; i < drinks.length ; i++) {
  		var drink = drinks[i];
	  	drink_data[drink.id] = drink;
		$('#drinkscontainer').append(
		  '<div class="col-xs-3 col-md-3" id="drink_'+drink.id+'">'+
			'<a href="#" class="thumbnail" data-id="'+drink.id+'">'+
			  '<img alt="'+drink.title+'" src="'+drink.img+'"/>'+
			  '<div class="caption">'+
				'<p>'+drink.title+'</p>'+
			  '</div>'+
			'</a>'+
		  '</div>'
		);
	}
	$('.thumbnail').on('click' , function(evt) {
		var id = '';
		if (evt.currentTarget.getAttribute('data-id')) {
			id = evt.currentTarget.getAttribute('data-id');
		} else {
			id = evt.currentTarget.parentElement.getAttribute('data-id');
		}
		drinkKlicked(id);
	});
  },
  dataType: 'json'
});

function drinkKlicked(id) {
	console.log('drink with id ' , id , ' got clicked');
	var drink = drink_data[id];
	drink_selected = drink_data[id];
	$('#myModal .modal-body').replaceWith(''+
	'<div class="modal-body">'+
		'<img alt="'+drink.title+'" src="'+drink.img+'" class="modal_image"/>'+
		'<div class="caption">'+
			'<p>'+drink.title+'</p>'+
		'</div>'+
	'</div>'+
	'');
	$('#myModal').modal('show');
}

function produceSelectedDrink() {
	console.log('will produce selected drink ' , drink_selected);
	for (var i = 0 ; i < drink_selected.ingredients.length ; i++ ) {
		sendCommand(drink_selected,i);
	}
	$('#myModal').modal('hide');
}

function sendCommand(drink_selected, i) {
	var toSend = dispenser_data[drink_selected.ingredients[i].type] + '' + drink_selected.ingredients[i].amount;
	console.log('toSend = ' , toSend);
	setTimeout(function() {
		console.log('toSend = ' , toSend);
		$.ajax({
			url: '/doit/' + toSend + '?date=' + Date.now(),
			contentType : "text/html",
			async : false,
			success: function(data) {
			}
		});
	},i*100);
}