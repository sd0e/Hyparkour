function toS(milliseconds) {
    let seconds = milliseconds / 1000;
    return seconds.toFixed(3);
}

function getId(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function watchVideo(videoId) {
    $('#video').attr('src', 'https://www.youtube.com/embed/' + videoId);
    $('.videoContainer').fadeIn();
}

var k = "4f91e38f-8979-47bb-afbf-78f98c93af58";

function difference(record, best) {
    let difference = best - record;
    return difference.toFixed(3);
}

async function submit(mcUsername) {
    console.log("Hyparkour - See Hypixel parkour records");
    $('.playerImage').attr('src', 'loading.gif');
    $('.notFound').hide();
    $('.unknown').hide();
    $('.problem').hide();
    $('.playerName').text('Loading...');
    $('.lobbies').html('');
    const headURL = `https://mc-heads.net/minecraft/profile/` + mcUsername;
    const headfetchResult = fetch(headURL)
    const headresponse = await headfetchResult;
    const headData = await headresponse.json();
    let uuid = headData.id;
    let head = `https://mc-heads.net/head/` + uuid + `.png`;
    $('.playerImage').attr('src', head);
    const hypixelURL = `https://api.hypixel.net/player?key=` + k + `&name=` + mcUsername;
    const hypixelfetchResult = fetch(hypixelURL)
    const hypixelresponse = await hypixelfetchResult;
    const hypixelData = await hypixelresponse.json();
    if (hypixelData.player != null) {
        let parkour = hypixelData.player.parkourCompletions;
        let parkourCheckpoints = hypixelData.player.parkourCheckpointBests;
        $('.playerName').text(hypixelData.player.displayname);
        if (parkour == undefined) {
            $('.notFound').show();
        } else {
            const fetchResult = fetch('info.json')
            const response = await fetchResult;
            const jsonData = await response.json();
            const speedrunsURL = 'https://www.speedrun.com/api/v1/games/v1pejmd8/records';
            const speedrunsfetchResult = fetch(speedrunsURL)
            const speedrunsresponse = await speedrunsfetchResult;
            const speedrunsjsonData = await speedrunsresponse.json();
            runs = speedrunsjsonData.data;
            Object.keys(jsonData).forEach(function(key) {
                let name = key;
                let otherData = jsonData[key];
                let displayName = otherData.displayName;
                let hypixelName = otherData.hypixelName;
                let speedrunLevel = otherData.speedrunLevel;
                Object.keys(runs).forEach(function(key2) {
                    let otherDataSpeedruns = runs[key2];
                    let runId = getId(otherDataSpeedruns.runs[0].run.videos.links[0].uri);
                    if (otherDataSpeedruns.level == speedrunLevel) {
                        let recordTime = otherDataSpeedruns.runs[0].run.times.primary_t;
                        // Do general parkour info here
                        Object.keys(parkour).forEach(function(key8) {
                            let parkourData = parkour[key8];
                            if (key8 == hypixelName) {
                                var bestTime = 100000000000;
                                Object.keys(parkourData).forEach(function(key9) {
                                    if (parkourData[key9].timeTook < bestTime) {
                                        bestTime = parkourData[key9].timeTook;
                                    }
                                });
                                var lengthOfParkours = Object.keys(parkourData).length;
                                var existingLength = 0;
                                Object.keys(parkourData).forEach(function(key10) {
                                    existingLength = existingLength + parkourData[key10].timeTook;
                                });
                                let averageTime = existingLength/lengthOfParkours;
                                if ($('.' + name).length == false) {
                                $('.lobbies').append(`
                                <div class="lobby" style="background: url(backgrounds/` + name + `.png) no-repeat center center;">
                                <div class="lobbyInfoContainer">
                                    <img src="icons/` + name + `.png" alt="Lobby Icon" class="lobbyIcon">
                                    <span class="lobbyName">` + displayName + `</span>
                                </div><br>
                                <span class="statContainer"><span class="completed stat">` + Object.keys(parkourData).length + `</span> successfully completed run(s).</span><br>
                                <span class="statContainer">The run(s) took an average of <span class="averageTime stat">` + toS(averageTime) + `s</span> to complete.</span><br>
                                <span class="statContainer">Their fastest run of <span class="fastestRun stat">` + toS(bestTime) + `s</span> was <span class="runDifference stat">` + difference(recordTime, toS(bestTime)) + `s</span> slower than the record of <span class="recordRun stat">` + recordTime + `s</span>.</span><br><br>
                                <div class="checkpoints ` + name + `"></div>
                                <small class="attribution"><a class="link" onclick="watchVideo('` + runId + `');" target="_blank">Watch a video of the record</a> - <a class="link" href="https://www.speedrun.com/mcm_hsp/` + name + `" target="_blank">View this lobby's records on speedrun.com</a></small>
                            </div>
                                `);
                                }
                            }
                        });
                        Object.keys(parkourCheckpoints).forEach(function(key3) {
                            let parkourCheckpointsData = parkourCheckpoints[key3];
                            if (key3 == hypixelName) {
                                let length = Object.keys(parkourCheckpointsData).length;
                                for (i = 0; i < length; i++) {
                                    let legibleNumber = i + 1;
                                    let checkpointClass = "chkpnt_" + legibleNumber + "_" + name;
                                    if ($('.' + checkpointClass).length == false) {
                                        $('.checkpoints.' + name).append('<span class="statContainer ' + checkpointClass + '">Checkpoint ' + legibleNumber + ' Best: <span class="averageTime stat">' + toS(parkourCheckpointsData[i]) + 's</span></span><br>');
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }
        $(".records").fadeIn();
    } else {
        if (hypixelData.success == false) {
            $('.playerName').text(mcUsername.charAt(0).toUpperCase() + mcUsername.slice(1));
            $(".problem").show();
            $(".records").fadeIn();
        } else {
            $('.playerName').text(mcUsername.charAt(0).toUpperCase() + mcUsername.slice(1));
            $(".unknown").show();
            $(".records").fadeIn();
        }
    }
}