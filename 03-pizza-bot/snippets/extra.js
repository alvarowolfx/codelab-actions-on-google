const POPULAR_PIZZA_TYPES = [
  {
    key: 'capricciosa',
    title: 'capricciosa',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pizza-a0bec.appspot.com/o/cappricciosa.png?alt=media'
  },
  {
    key: 'four cheese',
    title: 'four cheese',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pizza-a0bec.appspot.com/o/four_cheese.png?alt=media'
  },
  {
    key: 'margherita',
    title: 'margherita',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pizza-a0bec.appspot.com/o/marguerita.png?alt=media'
  },
  {
    key: 'marinara',
    title: 'marinara',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pizza-a0bec.appspot.com/o/marinara.png?alt=media'
  },
  {
    key: 'pepperoni',
    title: 'pepperoni',
    image:
      'https://firebasestorage.googleapis.com/v0/b/pizza-a0bec.appspot.com/o/peperonni.png?alt=media'
  }
];

/**
 * @param {DialogflowApp} assistant
 */
function listPizzaHandler(assistant) {
  const msg = 'Getting list of pizzas via Firebase';
  const carousel = assistant.buildCarousel().addItems(
    POPULAR_PIZZA_TYPES.map(pizza => {
      return assistant
        .buildOptionItem()
        .setImage(pizza.image, `Image of ${pizza.title}`)
        .setTitle(`I want a ${pizza.title} pizza`)
        .setKey(pizza.key);
    })
  );
  assistant.askWithCarousel('Which types do you like ?', carousel);
}

/**
 * @param {DialogflowApp} assistant
 */
function carouselPizzaHandler(assistant) {
  const param = assistant.getSelectedOption();
  assistant.setContext('order.pizza', 5, {
    type: param
  });
  assistant.ask('Which toppings do you like ?');
}
