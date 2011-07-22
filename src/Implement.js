/*
 * A method for mixing in functions to a class.
 * Taken from http://michaux.ca/articles/transitioning-from-java-classes-to-javascript-prototypes
 *
 * @param {Object} subclass The class to mix into.
 * @param {Object} superclass The class containing the functions to mix in.
 */
function implement(subclass, superclass) {
    for (var fn in superclass) {
        subclass.prototype[fn] = superclass[fn];
    }
}
