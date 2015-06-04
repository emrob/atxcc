<?php    // Topics.php
require_once 'DatabaseUsPsDb.php';

class Topics {
    
    //---------------------
    function __construct () {

        global $atxcc_db;
        $atxcc_db = new Database ('tgregone_atxcc', 'tgregone_atxcc', 'tgregone_atxcc$', 'localhost');
        
    } // end __construct ()

    
    
    //---------------------
    function topicsInit () {

        ?>
        <div id='agendaitems'>
            <h1 id='agendaheader'>Agenda Items</h1>

            <?php 
                $this->topicsShow ()
            ?>

        </div>

        <?php
    } // end topicsInit ()

    //---------------------
    function topicsShow () {

        $topics = $this->getTopics ();

        ?>
            <div id='ztopics'>
            <table class='table table-striped table-hover table-bordered'>
                <tbody>
                    <tr id='ztopicsheader'>
                        <th id='datecat'>Date</th>
                        <th id='itemcat'>Item</th>
                        <th id='descriptioncat'>Description</th>
                    </tr>

                        
                    <?php
                    $this -> topicsShowContent ($topics);
                    ?>

                </tbody>
            </table>
            </div>

        <?php

    } // end function topicsShow ()

    
    //---------------------
    function topicsShowContent ($topics) {

        foreach ($topics as $topic) {
            
            $items = $this->convTitle ($topic ['post_title']);

            ?>
            <tr class='ztopicsrow'> 
                <td class='zdate'> 
                    <?php 
                        echo ($items [1]);
                    ?>
                </td>
                <td class='zitem'> 
                    <?php 
                        echo ($items [0]);
                    ?>
                </td>
                <td class='zcontent'> 
                    <?php echo ($topic ['post_content']);?>
                </td>
            </tr>
            <?php

        } // end foreach ($topics as $topic)

    } // end topicsShowContent ($topics)

    //---------------------
    function getTopics () {

        global $atxcc_db;
        //$query = "SELECT post_title, post_content FROM wp_posts WHERE post_status='publish' AND post_type='topic' LIMIT 10";
        $query = "SELECT post_title, post_content FROM wp_posts WHERE post_status='publish' AND post_type='topic'";
        $rows = $atxcc_db -> doQuery ($query);

        return $rows;

    } // end getTopics ()

    
    
    //---------------------
    function getTopicsSearch ($keyword) {

        global $atxcc_db;

        $query = "SELECT post_title, post_content FROM wp_posts WHERE post_status='publish' AND post_type='topic' AND post_content LIKE '%$keyword%'";

        $rows = $atxcc_db -> doQuery ($query);

        return $rows;
        

    } // end getTopicsSearch (keyword)

    //---------------------
    function convTitle ($rawTitle) {

        if (preg_match ('/Item\s+(\d+)\s+\-\s+(\w+)\s+(\d+),\s*(\d+)/', $rawTitle, $matches)) {

            $itemNo = $matches [1];
            $month = $matches [2];
            $day = $matches [3];
            $year = $matches [4];

            $month3 = substr ($month, 0, 3);

            $monthsInt = [
                'Jan' => '01',
                'Feb' => '02',
                'Mar' => '03',
                'Apr' => '04',
                'May' => '05',
                'Jun' => '06',
                'Jul' => '07',
                'Aug' => '08',
                'Sep' => '09',
                'Oct' => '10',
                'Nov' => '11',
                'Dec' => '12',
            ];

            $monthInt = $monthsInt [$month3];

            $day = sprintf ('%02d', $day);
            $year = substr ($year, 2, 2);

            $items = [$itemNo, $monthInt . '/' . $day . '/' . $year];

        } else {

            $items = [$rawTitle, ""];

        } // end if (preg_match ())
        
        return $items;

    } // end convTitle ($rawTitle)


}

