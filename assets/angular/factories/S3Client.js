Wishginee.factory('S3Client', function ($q) {

    AWS.config.update({'accessKeyId' : '', 'secretAccessKey' : '' });
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
