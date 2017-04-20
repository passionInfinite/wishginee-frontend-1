Wishginee.factory('S3Client', function ($q) {

    AWS.config.update({'accessKeyId' : 'AKIAIXZ2K5EVH2D7JLKA', 'secretAccessKey' : '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' });
    AWS.config.region ='ap-south-1';

    var S3  = new AWS.S3({
        'Bucket' : 'wishginee-api'
    });
    var url = "https://s3.ap-south-1.amazonaws.com/wishginee-api/";

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