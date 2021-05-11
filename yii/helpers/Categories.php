<?php
namespace app\helpers;

use Yii;

class Categories{
	public static function getAllCategoriesArrayTxt() {
		$connection = Yii::$app->getDb();
		$command = $connection->createCommand("
		SELECT t1.id AS lev1, t1.active as active1, t1.name AS lev1name, 
				t2.id AS lev2,t2.name AS lev2name, t2.active as active2, 
			t3.id AS lev3, t3.name AS lev3name, t3.active as active3, 
				t4.id AS lev4, t4.name AS lev4name, t4.active as active4
    	FROM category AS t1
    		LEFT JOIN category AS t2 ON t2.parent_id = t1.id
    		LEFT JOIN category AS t3 ON t3.parent_id = t2.id
    		LEFT JOIN category AS t4 ON t4.parent_id = t3.id
    	WHERE t1.id=1 ORDER BY lev1, lev2, lev3, lev4
				");
		$result = $command->queryAll();
		
		$retArray=[];
		
		$lev1=$lev2=$lev3=$lev4=$prevLev1=$prevLev2=$prevLev3=$prevLev4=null;
		if (count($result))
			
		for ($j=0;$j<count($result)*4;$j++)
		{
			$i = (int)($j/4);
			$lev1 = $result[$i]['lev1'];
			$lev2 = $result[$i]['lev2'];
			$lev3 = $result[$i]['lev3'];
			$lev4 = $result[$i]['lev4'];
			$active1 = $result[$i]['active1'];
			$active2 = $result[$i]['active2'];
			$active3 = $result[$i]['active3'];
			$active4 = $result[$i]['active4'];
			if ($lev1!=$prevLev1 && $lev1!=null)
			{
				if (!$active1)
					continue;
				if ($lev1!=1) $retArray[$lev1]=$result[$i]['lev1name'];
				$prevLev1 = $lev1;
			} 
			if ($lev2!=$prevLev2 && $lev2!=null)
			{
				if (!$active2)
					continue;
				$retArray[$lev2]=$result[$i]['lev2name'];
				$prevLev2 = $lev2;
			} 
			if ($lev3!=$prevLev3 && $lev3!=null)
			{
				if (!$active3)
					continue;
				
				$retArray[$lev3]='--'.$result[$i]['lev3name'];
				$prevLev3 = $lev3;
			}  
			if ($lev4!=$prevLev4 && $lev4!=null)
			{
				if (!$active4)
					continue;
				
				$retArray[$lev4]='----'.$result[$i]['lev4name'];
				$prevLev4 = $lev4;
			}

		}
		return $retArray;;
	}

	public static function getSelectedCategoriesArray($id)
	{
		if ($id==0 || !is_numeric($id)) 
			return null;

		$connection = Yii::$app->getDb();
		$command = $connection->createCommand("
		SELECT t1.id AS lev1, t1.active as active1, t1.name AS lev1name, 
				t2.id AS lev2,t2.name AS lev2name, t2.active as active2, 
			t3.id AS lev3, t3.name AS lev3name, t3.active as active3, 
				t4.id AS lev4, t4.name AS lev4name, t4.active as active4
    	FROM category AS t1
    		LEFT JOIN category AS t2 ON t2.parent_id = t1.id
    		LEFT JOIN category AS t3 ON t3.parent_id = t2.id
    		LEFT JOIN category AS t4 ON t4.parent_id = t3.id
    	WHERE t1.id=$id ORDER BY lev1, lev2, lev3, lev4
				");
		$result = $command->queryAll();

		$tempCatIds=[];
		$prevLev1=$prevLev2=$prevLev3=$prevLev4=null;
		if (count($result))
			for ($i=0;$i<count($result);$i++)
			{
				$lev1 = $result[$i]['lev1'];
				$lev2 = $result[$i]['lev2'];
				$lev3 = $result[$i]['lev3'];
				$lev4 = $result[$i]['lev4'];
				$active1 = $result[$i]['active1'];
				$active2 = $result[$i]['active2'];
				$active3 = $result[$i]['active3'];
				$active4 = $result[$i]['active4'];
				
				if ($lev1!=$prevLev1 && $lev1!=null)
				{
					if (!$active1)
						continue;

					array_push($tempCatIds, $lev1);
					$prevLev1 = $lev1;
				}
				if ($lev2!=$prevLev2 && $lev2!=null)
				{
					if (!$active2)
						continue;

					array_push($tempCatIds, $lev2);							
					$prevLev2 = $lev2;
				}
				if ($lev3!=$prevLev3 && $lev3!=null)
				{
					if (!$active3)
						continue;
							
					array_push($tempCatIds, $lev3);
					$prevLev3 = $lev3;
				}
				if ($lev4!=$prevLev4 && $lev4!=null)
				{
					if (!$active4)
						continue;
							
					array_push($tempCatIds, $lev4);
					$prevLev4 = $lev4;
				}
		
			}
		
			return $tempCatIds;	
	}
	
	public static function getAllCategoriesArray() {
		$connection = Yii::$app->getDb();
		$command = $connection->createCommand("
		SELECT t1.id AS lev1, t1.active as active1, t1.name AS lev1name, 
				t2.id AS lev2,t2.name AS lev2name, t2.active as active2, 
			t3.id AS lev3, t3.name AS lev3name, t3.active as active3, 
				t4.id AS lev4, t4.name AS lev4name, t4.active as active4
    	FROM category AS t1
    		LEFT JOIN category AS t2 ON t2.parent_id = t1.id
    		LEFT JOIN category AS t3 ON t3.parent_id = t2.id
    		LEFT JOIN category AS t4 ON t4.parent_id = t3.id
    	WHERE t1.id=1 ORDER BY lev1, lev2, lev3, lev4
				");
		$result = $command->queryAll();
	
		$retArray=[];
		$tempCatIds = [];
		$retCatIds = [];
		
		$prevLev1=$prevLev2=$prevLev3=$prevLev4=null;
		if (count($result))
			for ($i=0;$i<count($result);$i++)
			{
				$lev1 = $result[$i]['lev1'];
				$lev2 = $result[$i]['lev2'];
				$lev3 = $result[$i]['lev3'];
				$lev4 = $result[$i]['lev4'];
				$active1 = $result[$i]['active1'];
				$active2 = $result[$i]['active2'];
				$active3 = $result[$i]['active3'];
				$active4 = $result[$i]['active4'];
				
				if ($lev1!=$prevLev1 && $lev1!=null)
				{
					if (!$active1)
						continue;
							
					$retArray[$lev1]['name']=$result[$i]['lev1name'];
					$prevLev1 = $lev1;
				}
				if ($lev2!=$prevLev2 && $lev2!=null)
				{
					if (!$active2)
						continue;
							
					if (count($tempCatIds)>0)
						array_push($retCatIds, $tempCatIds);
					$tempCatIds=[];
					array_push($tempCatIds, $lev2);
					
					$retArray[$lev1][$lev2]['name']=$result[$i]['lev2name'];
					$prevLev2 = $lev2;
				}
				if ($lev3!=$prevLev3 && $lev3!=null)
				{
					if (!$active3)
						continue;
							
					array_push($tempCatIds, $lev3);
					$retArray[$lev1][$lev2][$lev3]['name']=$result[$i]['lev3name'];
					$prevLev3 = $lev3;
				}
				if ($lev4!=$prevLev4 && $lev4!=null)
				{
					if (!$active4)
						continue;
							
					array_push($tempCatIds, $lev4);
					$retArray[$lev1][$lev2][$lev3][$lev4]['name']=$result[$i]['lev4name'];
					$prevLev4 = $lev4;
				}
				
			}
		
		// one last time left to array push..
		if (count($tempCatIds)>0)
			array_push($retCatIds, $tempCatIds);
		
		$retVal[0]=$retArray;
		$retVal[1]=$retCatIds;

		return $retVal;
	}
	
	public static function getParent($id) {
		$connection = Yii::$app->getDb();
		$command = $connection->createCommand("SELECT category.id AS catid, category.name, parent.id AS parid, parent.name AS parname
								FROM category AS category LEFT JOIN category AS parent 
								ON  parent.id=category.parent_id 
								WHERE category.id=$id");
		$result = $command->queryAll();
		return $result;
	}
}