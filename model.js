YUI().use('model', 'model-list', 'view', 'node', 'event', 'io', 'json', function(Y) {

	var isNumber = function (value) {
        return typeof value === 'number' && !isNaN(value);
    }

	OAClient.AnnotationModel = Y.Base.create ('annotationModel', Y.Model, [], {
		validate: function (attributes) {
			if (!isNumber(attributes.posFrom) ||
				!isNumber(attributes.posTo))
				return 'posFrom and posTo must be a number';
		}
	}, {
		ATTRS:  {
			
			uri: {value: null},

			bodyMediatype: {value: null},

			bodyContent:{value: null},

			posFrom: {value: null,
					  validator: isNumber
					 },
			
			posTo: {value: null,
					validator: isNumber
				   },
		}
	});
	
	OAClient.AnnotationList = function(config) {

        OAClient.AnnotationList.superclass.constructor.apply(this, arguments);
		
	};
	
	Y.extend (OAClient.AnnotationList, Y.ModelList, {
		
		name: 'annotationList',
		
		model: OAClient.AnnotationModel

	});

});