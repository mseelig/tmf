
// compare from http://www.yoxigen.com/blog/index.php/2010/04/javascript-function-to-deep-compare-json-objects/
function compare(obj1, obj2)
{
    function size(obj)
    {
        var size = 0;
        for (var keyName in obj)
        {
            if (keyName != null)
                size++;
        }
        return size;
    }

    if (size(obj1) != size(obj2))
        return false;

    for(var keyName in obj1)
    {
        var value1 = obj1[keyName];
        var value2 = obj2[keyName];

        if (typeof value1 != typeof value2)
            return false;

        // For jQuery objects:
        if (value1 && value1.length && (value1[0] !== undefined && value1[0].tagName))
        {
            if(!value2 || value2.length != value1.length || !value2[0].tagName || value2[0].tagName != value1[0].tagName)
                return false;
        }
        else if (typeof value1 == 'function' || typeof value1 == 'object') {
            var equal = compare(value1, value2);
            if (!equal)
                return equal;
        }
        else if (value1 != value2)
            return false;
    }
    return true;
}