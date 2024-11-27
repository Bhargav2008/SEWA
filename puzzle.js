



var images = [
    { src: 'https://i0.wp.com/indianvagabond.com/wp-content/uploads/2018/08/baolis-of-delhi-4.jpg?resize=1200%2C795&ssl=1', title: 'Image 1' },
    { src: 'https://i0.wp.com/indianvagabond.com/wp-content/uploads/2018/08/baolis-of-delhi-13.jpg?resize=1200%2C795&ssl=1', title: 'Image 2' },
    { src: 'https://images.deccanherald.com/deccanherald/import/sites/dh/files/article_images/2019/08/25/file75rv4fyxuqwdm8pubbt-1566734692.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true', title: 'Image 3' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7-u_qNneKSRN6Uz5k8Blm7v3blFR0g2QJEw&s', title: 'Image 4' },
    { src: 'https://media-cdn.tripadvisor.com/media/photo-s/0b/69/c8/2c/view-from-front.jpg', title: 'Image 5' },
];

var gridSize = 3;
var turn = 0;


function newPhoto() {
    turn++;
    if (gridSize < 5 && turn % 2 == 0) {
        gridSize++;
    }
    stepCount = 0;
    $('.stepCount').text(stepCount);
    imagePuzzle.startGame(images, gridSize);
    $('#actualImageBox').show();
    $('#gameOver').hide();


};


$(function () {
    imagePuzzle.startGame(images, gridSize);
});


var imagePuzzle = {
    stepCount: 0,
    startGame: function (images, gridSize) {
        this.setImage(images, gridSize);
        $('#playPanel').show();
        $('#sortable').randomize();
        this.enableSwapping('#sortable li');
        this.stepCount = 0;
    },

    enableSwapping: function (elem) {
        $(elem).draggable({
            snap: '#droppable',
            snapMode: 'outer',
            revert: "invalid",
            helper: "clone"
        });
        $(elem).droppable({
            drop: function (event, ui) {
                var $dragElem = $(ui.draggable).clone().replaceAll(this);
                $(this).replaceAll(ui.draggable);

                currentList = $('#sortable > li').map(function (i, el) { return $(el).attr('data-value'); });
                if (isSorted(currentList)) {
                    $('#actualImageBox').hide();
                    $('#gameOver').show().html();
                }
                else {
                    imagePuzzle.stepCount++;
                    $('.stepCount').text(imagePuzzle.stepCount);
                }

                imagePuzzle.enableSwapping(this);
                imagePuzzle.enableSwapping($dragElem);
            }
        });
    },

    setImage: function (images, gridSize) {
        var percentage = 100 / (gridSize - 1);
        var imageIndex = Math.floor(Math.random() * images.length);
        var image = images[imageIndex];

        $('#imgTitle').html(image.title);
        $('#actualImage').attr('src', image.src);
        $('#sortable').empty();

        for (var i = 0; i < gridSize * gridSize; i++) {
            var xpos = (percentage * (i % gridSize)) + '%';
            var ypos = (percentage * Math.floor(i / gridSize)) + '%';
            var li = $('<li class="item" data-value="' + i + '"></li>').css({
                'background-image': 'url(' + image.src + ')',
                'background-size': (gridSize * 100) + '%',
                'background-position': xpos + ' ' + ypos,
                'width': 400 / gridSize,
                'height': 400 / gridSize
            });
            $('#sortable').append(li);
        }

        images.splice(imageIndex, 1); // Remove used image
        $('#sortable').randomize();
    }
};


function isSorted(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] != i)
            return false;
    }
    return true;

}
$.fn.randomize = function (selector) {
    var $elems = selector ? $(this).find(selector) : $(this).children(),
        $parents = $elems.parent();

    $parents.each(function () {
        $(this).children(selector).sort(function () {
            return Math.round(Math.random()) - 0.5;
        }).remove().appendTo(this);
    });
    return this;
};
