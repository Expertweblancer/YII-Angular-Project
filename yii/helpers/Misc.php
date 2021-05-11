<?php

namespace app\helpers;

class Misc{
	public static function getCmsMenu()
	{
		return \app\models\cms\Cms::find()->all();
	}
}