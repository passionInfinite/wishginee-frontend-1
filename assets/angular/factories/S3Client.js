Wishginee.factory('S3Client', function ($q) {

    AWS.config.update({'accessKeyId' : 'AKIAIFC763DOFMQFODHQ', 'secretAccessKey' : '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' });
    AWS.config.region ='ap-south-1';

    var S3  = new AWS.S3({
        'Bucket' : 'wishginee-photos'
    });
    var url = "https://s3.ap-south-1.amazonaws.com/wishginee-photos/";

    return {
        uploadPhoto : function (params) {
            var deferred = $q.defer();

            S3.putObject(params, function (error, data) {
                if (!error) {
                    return deferred.resolve(url+params.Key);
                }
            });
            return deferred.promise;
        }
    }
});
