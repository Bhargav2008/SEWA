



var images = [
    { src: 'img/RajaonkiBaoli.jpg', title: 'Rajon ki Baoli, Mehrauli Archaeological Park of Delhi' },
    { src: 'img/nizamuddin.jpg', title: 'Hazrat Nizamuddin Baoli' },
    { src: 'img/firoz.jpg', title: 'Feroz Shah Kotla Baoli' },
    { src: 'img/agrasen.jpg', title: 'Agrasen Ki Baoli' },
    { src: 'img/gandak.jpg', title: 'Gandhak Ki Baoli' },
    { src: 'img/puranaquila.jpg', title: 'Purana Qila Baoli' },
    { src: 'img/tuglaqbad.jpg', title: 'Tughlakabad Baoli' },
    { src: 'img/dwarka.jpg', title: 'Loharehri Baoli, Sector 12, Dwarka' },

];

var gridSize = 3;
var turn = 0;
var isGameOver = false;


function newPhoto() {
    turn++;
    if (gridSize < 5 && turn % 2 == 0) {
        gridSize++;
    }
    stepCount = 0;
    isGameOver = false;
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
        if (isGameOver) return;

        $(elem).draggable({
            snap: '#droppable',
            snapMode: 'outer',
            revert: "invalid",
            helper: "clone"
        });
        $(elem).droppable({
            drop: function (event, ui) {
                if (isGameOver) return;
                var $dragElem = $(ui.draggable).clone().replaceAll(this);
                $(this).replaceAll(ui.draggable);

                currentList = $('#sortable > li').map(function (i, el) { return $(el).attr('data-value'); });
                if (isSorted(currentList)) {
                    $('#actualImageBox').hide();
                    $('#gameOver').show().html();
                    isGameOver = true;
                    if (images.length == 0) {
                        $('#newPhoto').hide();
                    }
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
        var size = $('#sortable').width()

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
                'width': size / gridSize,
                'height': size / gridSize
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