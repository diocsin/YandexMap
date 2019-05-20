Ext.define('Isidamaps.util.Util', {
    statics: {
        errorMessage: function (title, msg) {
            Ext.Msg.alert(title, msg, Ext.emptyFn);
           /* Ext.Msg.show({
                title: 'Ошибка',
                message: msg,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });*/
        }
    }
});