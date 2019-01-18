(function (blink) {
	'use strict';

	var AnayaStyle = function () {
			blink.theme.styles.basic.apply(this, arguments);
		},
		page = blink.currentPage;

	AnayaStyle.prototype = {
		//BK-15873 aÃ±adimos el estilo basic como parent para la herencia de los estilos del CKEditor
		parent: blink.theme.styles.basic.prototype,
		bodyClassName: 'content_type_clase_anaya',
		toolbar: { name: 'editorial', items: ['Blink_wrapper', 'Blink_aside', 'Blink_custom_lists'] },
		extraPlugins: ['image2', 'blink_wrapper', 'blink_aside', 'blink_custom_lists'],
		ckEditorStyles: {
			name: 'anaya',
			styles: [
				{ name: 'subtitle', element: 'h4', attributes: { 'class': 'anaya-subtitle'} },
				{ name: 'header', element: 'h6', attributes: { 'class': 'anaya-header'} },
				{ name: 'competencias subtitle', element: 'h6', attributes: { 'class': 'anaya-competencias-subtitle'} },
				{ name: 'ejercicio', element: ['p', 'li'], attributes: { 'class': 'anaya-exercise' } },

				{ name: 'box-center', type: 'widget', widget: 'blink_wrapper', attributes: { 'class': 'center' } },
				{ name: 'aside-right', type: 'widget', widget: 'blink_aside', attributes: { 'class': 'right' } },

				//BK-15873 Quitamos el estilo versalitas, ya que lo hereda de basic

				{ name: 'img-right', element: 'img', attributes: { 'class': 'bck-img right' } },
				{ name: 'img-left', element: 'img', attributes: { 'class': 'bck-img left' } },

				{ name: 'Tabla 1', element: 'table', type: 'bck-stack-class', attributes: { 'class': 'table1' } },
				{ name: 'Tabla 2', element: 'table', type: 'bck-stack-class', attributes: { 'class': 'table2' } },
				{ name: 'Tabla 3', element: 'table', type: 'bck-stack-class', attributes: { 'class': 'table3' } },
				{ name: 'Tabla azul claro', element: 'table', attributes: { 'data-color': 'light-blue' } },
				{ name: 'Tabla azul oscuro', element: 'table', attributes: { 'data-color': 'dark-blue' } },
				{ name: 'Tabla fucsia', element: 'table', attributes: { 'data-color': 'fucsia' } },
				{ name: 'Tabla verde claro', element: 'table', attributes: { 'data-color': 'light-green' } },
				{ name: 'Tabla verde oscuro', element: 'table', attributes: { 'data-color': 'dark-green' } },
				{ name: 'Tabla verde agua', element: 'table', attributes: { 'data-color': 'water-green' } },
				{ name: 'Tabla naranja', element: 'table', attributes: { 'data-color': 'orange' } },
				{ name: 'Tabla roja', element: 'table', attributes: { 'data-color': 'red' } },
				{ name: 'Tabla centrada', element: 'table', type: 'bck-stack-class', attributes: { 'class': 'bck-table-center'} },


				{ name: 'Palabra azul claro', element: 'span', attributes: { 'class': 'bck-light-blue' } },
				{ name: 'Palabra fucsia', element: 'span', attributes: { 'class': 'bck-fucsia' } },
				{ name: 'Palabra morada', element: 'span', attributes: { 'class': 'bck-purple' } },
				{ name: 'Palabra roja', element: 'span', attributes: { 'class': 'bck-red' } },
				{ name: 'Palabra verde agua', element: 'span', attributes: { 'class': 'bck-esmerald' } },
				{ name: 'Palabra naranja', element: 'span', attributes: { 'class': 'bck-orange' } }
			]
		},
		slidesTitle: {},

		onLoadImg: function () {

		},

		bindEventsToEditor: function (editor) {
			editor.on('saveSnapshot', function (evt) {
				if (!this.container) return;
				$(this.container.$).find('.image-reduce')
					.each(function (index, element) {
						this.onload && this.onload();
					});
			});
		},

		init: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.init.call(this);
			this.addActivityTitle();
			if(window.esWeb) return;
			this.removeFinalSlide();
			this.fillSlidesTitle();
			this.formatCarouselindicators();
			this.addSlideNavigators();
		},

		removeFinalSlide: function () {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.removeFinalSlide.call(this, true);
		},

		addActivityTitle: function () {
			if (!blink.courseInfo || !blink.courseInfo.unit) return;
			$('.libro-left').find('.title').html(function () {
				return $(this).html() + ' > ' + blink.courseInfo.unit;
			})
		},

		fillSlidesTitle: function () {
			var self = this.slidesTitle;

			for (var index = 0; index < window.secuencia.length; index++) {
				var slide = window['t'+index+'_slide'];
				var slideTitle = slide.title;

				slideTitle = slideTitle.replace(/<span class="index">\s*([\d]+)\s*<\/span>/i, '$1. ');
				slideTitle = slideTitle.replace(/\s+/, ' ');
				slideTitle = stripHTML(slideTitle);

				self['t'+index+'_slide'] = slideTitle;
			}
		},

		formatCarouselindicators: function () {
			var $navbarBottom = $('.navbar-bottom'),
				$carouselIndicators = $('.slider-indicators').find('li');

			var dropDown = '' +
					'<div class="dropdown">' +
						'<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">' +
							'Ãndice' +
							'<span class="caret"></span>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">';

			$navbarBottom.find('li').tooltip('destroy');

			var navigatorIndex = 0;
			var navLabel = 0;

			for (var index = 0; index < window.secuencia.length; index++) {
				var slide = eval('t'+index+'_slide'),
					slideTitle = slide.title.replace(/<span class="index">[\d]+<\/span>/g, ''),
					numIndice = (navigatorIndex == 0)?'I':navLabel,
					textIndice = (navigatorIndex == 0) ? 'IntroducciÃ³n' : stripHTML(slideTitle);
				var clase = '';


				if (slide.isConcatenate) continue;

				if (slide.seccion) {

					if(slide.seccion == 'taller')
						clase = ('fa fa-edit');
					else
						clase = ('fa fa-check');
				}

				dropDown += '<li role="presentation"><a role="menuitem"><span class="num '+ (clase ? clase: '')+'" data-title="'+stripHTML(slideTitle)+'">' + (clase ? '': numIndice + '.') + '</span> <span class="title">' + textIndice + '</span></a></li>';
				$navbarBottom.find('li').eq(navigatorIndex).html('<span title="'+ stripHTML(slideTitle) +'" class="'+ (clase ? clase: '')+'">'+(clase ? '': numIndice)+'</span>');

				if (!slide.seccion) {
					navLabel++;
				}

				navigatorIndex++;

			};

			dropDown += '' +
						'</ul>' +
					'</div>';

			$navbarBottom
				.attr('class', 'anaya-navbar')
				.wrapInner('<div class="navbar-content"></div>')
				.find('ol')
					.before(dropDown)
					.wrap('<div id="top-navigator"/>')
					.end()
				.find('.dropdown').find('li')
					.on('click', function (event) {
						$navbarBottom.find('ol').find('li').eq($(this).index()).trigger('click');
					});

			$('.slider-indicators').find('li:eq(0) span').removeClass('fa fa-cog').html('I');

			if (!blink.hasTouch) {
				$navbarBottom
					.find('ol').find('span')
						.tooltip({
							placement: 'bottom',
							container: 'body'
						});
			}

			blink.events.trigger(true, 'style:endFormatCarousel');
		},

		addSlideNavigators: function () {
			var $navigator = $('<div class="navigator"><div class="main-navigator"><div class="left"></div><div class="right"></div></div></div>'),
				$leftControl = $('.left.slider-control').clone(),
				$rightControl = $('.right.slider-control').clone();

			var self = this.slidesTitle;

			var esdeber = blink.activity.esdeber;

			$leftControl.add($rightControl).find('span').remove();

			var slideIndex = 0; // se utiliza como indice para saltarnos los concatenados en el each
			var slidesNav = $('.item-container');
			// Filtramos para que solo coja las slides que no son final slide para iterar sobre ellas
			slidesNav = slidesNav.filter(function(element){
				if ($(slidesNav[element]).find('#final').length > 0) {
					return false;
				}
				return true;
			});

			slidesNav.each(function (index, element) {
				var $itemNavigator = $navigator.clone(),
					$left, $right, hasLeft = false;

				var prevSlide,
					prevIndex = slideIndex-1;
				// si  hay una slide anterior se recorre hacia atras hasta que no haya concatenados
				// si estoy en la slide 0 no se pinta
				while(prevIndex>=0){
					prevSlide = window['t'+ prevIndex +'_slide'];
					if(!esdeber && prevSlide.isConcatenate){
						prevIndex--;
					}
					else{
						$left = $leftControl.clone();
						$left.append('<span class="title">'+self['t'+prevIndex+'_slide']+'</span>');
						$itemNavigator.find('.left').append($left);
						hasLeft = true;
						break;
					}
				}

				slideIndex++;
				var nextSlide;
				// si  hay una slide siguiente se recorre hacia adelante hasta que no haya concatenados
				// si estoy en la slide ultima no se pinta boton next
				while(slideIndex<window.secuencia.length){
					nextSlide = window['t'+ slideIndex +'_slide'];
					if(!esdeber && nextSlide.isConcatenate){
						slideIndex++;
					}
					else{
						$right = $rightControl.clone();
						$right.prepend('<span class="title">'+self['t'+slideIndex+'_slide']+'</span>');
						$itemNavigator.find('.right').append($right);
						hasLeft && $right.parent('.right').addClass('separator');
						break;
					}
				}
				$(element).append($itemNavigator);
			});

			$('.navigator')
				.on('click', '.left.slider-control', function () {
					blink.activity.showPrevSection();
				})
				.on('click', '.right.slider-control', function () {
					blink.activity.showNextSection();
				});
		},

		//BK-15873 Quitamos la funcion getEditorStyles para que la herede de basic

                changeHighBar: function () {
                    if($('.anaya-navbar').length>0 && $('.navbar').length>0){
                        blink.theme.setTopByHeight('.navbar', '.anaya-navbar');
                    }
                }
	};

	AnayaStyle.prototype = _.extend({}, new blink.theme.styles.basic(), AnayaStyle.prototype);

	blink.theme.styles.anaya = AnayaStyle;

})( blink );
