
ZICA = {
	version:'0.1',
	author: 'Zeljko Ivanovic'
};

ZICA.boxIntersection = function (a, b) {
    return (a.x < b.x + b.width && a.x + a.width > b.x) && (a.y < b.y + b.height && a.y + a.height > b.y);
};

ZICA.Keys = ["Left Mouse Button", "Right Mouse Button", "Escape", "Enter", "Tab", "Shift", "Control", "Space", "Left", "Up", "Right", "Down", "Delete", "App Menu Key", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


/**
ZICA.Vect2d, ZICA.Animator & ZICA.Action (and their extends) are modified classes from the copperlitch open source library
https://github.com/Sebmaster/copperlicht
https://www.ambiera.com/copperlicht/

CopperLicht License
Copyright © 2009-2020 Nikolaus Gebhardt

This software is provided 'as-is', without any express or implied warranty. In no event will the authors be held liable for any damages arising from the use of this software.

Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it subject to the following restrictions:

If you use this software in a product, an acknowledgment in the product documentation is necessary.
Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
This notice may not be removed or altered from any source distribution.
*/

/**
 * 2d vector class, used for example for texture coordinates.
 * @class 2d vector class, used for example for texture coordinates.
 * @constructor
 * @param {Number} x x coordinate. Can be null.
 * @param {Number} y y coordinate.
 */
ZICA.Vect2d = function(x, y)
{
	if (x == null)
	{
		this.X = 0;
		this.Y = 0;
	}
	else
	{
		this.X = x;
		this.Y = y;
	}
}

/**
 * X coordinate of the vector
 * @public
 * @type Number
 */
ZICA.Vect2d.prototype.X = 0;

/**
 * Y coordinate of the vector
 * @public
 * @type Number 
 */
ZICA.Vect2d.prototype.Y = 0;

/**
 * Sets all 2 coordinates to new values
 * @private
 */
ZICA.Vect2d.prototype.set = function(x,y)
{
	this.X = x;
	this.Y = y;
}

/**
 * Creates a copy of this vector and returns it
 * @public
 * @type Vect2d
 */
ZICA.Vect2d.prototype.clone = function()
{
	return new ZICA.Vect2d(this.X,this.Y);
}
ZICA.Vect2d.prototype.add = function(other)
{
	return new ZICA.Vect2d(this.X+other.X, this.Y+other.Y);
}

ZICA.Vect2d.prototype.multiplyWithVect = function(v)
{
	return new ZICA.Vect2d(this.X * v.X, this.Y * v.Y);
}
ZICA.Vect2d.prototype.multiplyWithScal = function(v)
{
	return new ZICA.Vect2d(this.X*v, this.Y*v);
}
ZICA.Vect2d.prototype.getLength = function()
{
	return Math.sqrt(this.X*this.X + this.Y*this.Y );
}
ZICA.Vect2d.prototype.substract = function(other)
{
	return new ZICA.Vect2d(this.X-other.X, this.Y-other.Y);
}

ZICA.Vect2d.prototype.normalize = function()
{
	var l = this.X*this.X + this.Y*this.Y;
	if (l > -0.0000001 && l < 0.0000001)
		return;
		
	l = 1.0 / Math.sqrt(l);
	this.X *= l;
	this.Y *= l;
}
ZICA.Vect2d.prototype.addToThis = function(other)
{
	this.X += other.X;
	this.Y += other.Y;
}
////////////////////////////////////////////////////////
///////ZICA.Animator
//////////////////////////////////////////////////////

ZICA.Animator = function()
{
	this.Type = -1;
}

/** 
 * Returns the type of the animator.
 * Usual values are 'none', 'camerafps', etc. See the concreate animator implementations for type strings.
 * @public
 */
ZICA.Animator.prototype.getType = function()
{
	return '';
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.Animator.prototype.animateNode = function(n, timeMs)
{
	return false;
}		

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseDown = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onClick = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseWheel = function(delta) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseUp = function(event) 
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseMove = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseOut = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * @public
 */
ZICA.Animator.prototype.onMouseOver = function(event)
{
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input.
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyDown = function(event)
{
	return false;
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyUp = function(event)
{
	return false;
}

/**
 * Event handler called by the engine so the animator can react to mouse and key input
 * Returns false if the event has not been processed.
 * @public
 */
ZICA.Animator.prototype.onKeyPress = function(event)
{
	return false;
}
/**
 * Event handler called by the engine so the animator can react when the entity was called by another entity
 * @public
 */
ZICA.Animator.prototype.onCollision = function(event)
{
}
/**
 * Resets the animator, if supported
 * @private
 */
ZICA.Animator.prototype.reset = function(event) 
{
}


/**
 * @private
 */
ZICA.Animator.prototype.findActionByType = function(type)
{
	return null;
}


/**
 * Creates an exact, deep copy of this animator
 * @public
 */
ZICA.Animator.prototype.createClone = function()
{
	return null;
}

/////////////////////////////////////////////////////
//AnimatorRotation
/////////////////////////////////////////////////////

/**
 * Scene node animator making {@link ZICA.Entity}s rotate
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class  Scene node animator making {@link ZICA.Entity}s rotate
 * @param speed {ZICA.Vect2d} vector defining the RotationSpeed in each direction
 */
ZICA.AnimatorRotation = function(obj)
{
		this.Rotation = obj.Speed;
		
	this.StartTime = Date.now();//ZICA.CLTimer.getTime();
	
	this.RotateToTargetAndStop = false; // for setRotateToTargetAndStop
	this.RotateToTargetEndTime = 0; // for setRotateToTargetAndStop
	this.BeginRotation = null; // for setRotateToTargetAndStop
}		
ZICA.AnimatorRotation.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorRotation, this will return 'rotation'.
 * @public
 */
ZICA.AnimatorRotation.prototype.getType = function()
{
	return 'rotation';
}

/** 
 * @private
 */
ZICA.AnimatorRotation.prototype.createClone = function()
{
	var a = new ZICA.AnimatorRotation({});
	a.Rotation = this.Rotation;
	a.StartTime = this.StartTime;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param timeMs: The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorRotation.prototype.animateNode = function(n, timeMs)
{
	var timeMs = Date.now();
	var difftime = timeMs - this.StartTime;

	if (!this.RotateToTargetAndStop)
	{
		if (difftime != 0)
		{
			n.angle += this.Rotation*(difftime / 10.0);
			//n.Rot.addToThis( this.Rotation.multiplyWithScal(difftime / 10.0) );
			
			this.StartTime = timeMs;
			return true;
		}
	}
	else
	{
		// rotate to a target rotation and then stop
		
		if (this.RotateToTargetEndTime - this.StartTime == 0)
			return false;

		var interpol = (timeMs - this.StartTime) / (this.RotateToTargetEndTime - this.StartTime);
		if (interpol > 1.0)
		{
			// end reached, destroy this animator
			//n.Rot = this.Rotation.clone();
			n.angle = this.Rotation;
			n.removeAnimator(this);
		}
		else
		{
			// interpolate 
			n.angle = this.BeginRotation + ((this.Rotation - this.BeginRotation) * interpol);	
			
			return true;
		}
	}
	
	return false;
}

/**
 * Makes the animator rotate the scene node to a specific target and then stop there
 * @private
 */
ZICA.AnimatorRotation.prototype.setRotateToTargetAndStop = function(targetRot, beginRot, timeForMovement)
{		
	this.RotateToTargetAndStop = true;
	this.Rotation = targetRot;
	this.BeginRotation = beginRot;
	this.RotateToTargetEndTime = this.StartTime + timeForMovement;
}		

//////////////////////////////////////////////////////
//+ AnimatorFlyStraight
/////////////////////////////////////////////

/**
 * Scene node animator making {@link ZICA.Entity}s move along straight line between two points.
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class Scene node animator making {@link ZICA.Entity}s move along straight line between two points.
 * @param {ZICA.Vect2d} start Start 2d position of the line
 * @param {ZICA.Vect2d} end End 2d position of the line
 * @param {Number} timeForWay Time for moving along the whole line in milliseconds. For example 2000 for 2 seconds.
 * @param {Boolean} loop set to true for looping along the line, false for stopping movement when the end has been reached.
 * @param {Boolean} deleteMeAfterEndReached set to true if the animator should delete itself after the end has been reached.
 * @param {Boolean} animateCameraTargetInsteadOfPosition if the animated node is a camera, set to true to animate the camera target instead of the position of the camera.
 */
ZICA.AnimatorFlyStraight = function(obj)
{
	//start, end, timeforway, loop, deleteMeAfterEndReached, animateCameraTargetInsteadOfPosition
	
	this.Start = new ZICA.Vect2d(0,0);	
	this.End = new ZICA.Vect2d(40,40);
	this.StartTime = Date.now();//ZICA.CLTimer.getTime();
	this.TimeForWay = 3000;
	this.Loop = false;
	this.DeleteMeAfterEndReached = false;
	this.AnimateCameraTargetInsteadOfPosition = false;
	
	this.TestShootCollisionWithBullet = false;
	this.ShootCollisionNodeToIgnore = null;
	this.ShootCollisionDamage = 0;
	this.DeleteSceneNodeAfterEndReached = false;
	this.ActionToExecuteOnEnd = false;
	this.ExecuteActionOnEndOnlyIfTimeSmallerThen = 0;
	
	
	
		if(obj.Start)
		this.Start = obj.Start.clone();
		
		if(obj.End)
		this.End = obj.End.clone();
		
		if(obj.TimeForWay)
		this.TimeForWay = obj.TimeForWay;

		if(obj.Loop)
		this.Loop = obj.Loop;	
	
	
	this.recalculateImidiateValues();
	
	if (obj.deleteMeAfterEndReached)
		this.DeleteMeAfterEndReached = obj.deleteMeAfterEndReached;
	if (obj.animateCameraTargetInsteadOfPosition)
		this.AnimateCameraTargetInsteadOfPosition = obj.animateCameraTargetInsteadOfPosition;	
}		
ZICA.AnimatorFlyStraight.prototype = new ZICA.Animator();



/** 
 * Returns the type of the animator.
 * For the AnimatorFlyStraight, this will return 'flystraight'.
 * @public
 */
ZICA.AnimatorFlyStraight.prototype.getType = function()
{
	return 'flystraight';
}

/** 
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.createClone = function()
{
	var a = new ZICA.AnimatorFlyStraight({});
	a.Start = this.Start.clone();
	a.End = this.End.clone();
	a.Vector = this.Vector.clone();
	a.WayLength = this.WayLength;
	a.TimeFactor = this.TimeFactor;
	a.TimeForWay = this.TimeForWay;
	a.Loop = this.Loop;
	a.AnimateCameraTargetInsteadOfPosition = this.AnimateCameraTargetInsteadOfPosition;
	a.DeleteSceneNodeAfterEndReached = this.DeleteSceneNodeAfterEndReached;
	a.ActionToExecuteOnEnd = this.ActionToExecuteOnEnd ? this.ActionToExecuteOnEnd.createClone() : null;
	a.ExecuteActionOnEndOnlyIfTimeSmallerThen = this.ExecuteActionOnEndOnlyIfTimeSmallerThen;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorFlyStraight.prototype.animateNode = function(n, event)
{
	var timeMs = Date.now();
	
	var t = (timeMs-this.StartTime);
	var endReached = false;

	if (t != 0)
	{
		var pos = this.Start.clone();

		if (!this.Loop && t >= this.TimeForWay)
		{
			pos = this.End.clone();
			endReached = true;
		}
		else
		{
			pos.addToThis(this.Vector.multiplyWithScal( (t % this.TimeForWay) * this.TimeFactor));
		}
			
		if (this.AnimateCameraTargetInsteadOfPosition)
		{
			/* if (n.getType() == 'camera')
			{
				n.setTarget(pos);
				
				var animfps = n.getAnimatorOfType('camerafps');
				if (animfps != null)
					animfps.lookAt(pos);
			} */
		}
		else
		{
			//n.Pos = pos;
			n.x = pos.X;
			n.y = pos.Y;
		}
		
		if (this.TestShootCollisionWithBullet && this.StartTime != timeMs)  // the node must not be in the exact same frame it was created in,
																			// otherwise, we risk an endless loop if the bullet is shot in the onHit handler
		{
			endReached = this.doShootCollisionTest(n) || endReached;
		}
		
		if (endReached)
		{
			/* if (n.scene)
				n.scene.LastBulletImpactPosition = n.Pos.clone();
						
			if (this.ActionToExecuteOnEnd)
			{
				var runAction = true;
				if (this.ExecuteActionOnEndOnlyIfTimeSmallerThen > 0 && t > this.ExecuteActionOnEndOnlyIfTimeSmallerThen)
					runAction = false;
				
				if (runAction)
					this.ActionToExecuteOnEnd.execute(n);
			} */
				
			if (this.DeleteMeAfterEndReached)
				n.removeAnimator(this);
				
			/* if (this.DeleteSceneNodeAfterEndReached && n.scene)
				n.scene.addToDeletionQueue(n, 0); */
		}
		
		return true;
	}
	
	return false;
}	

/**
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.doShootCollisionTest = function(bulletNode)	
{
	if (!bulletNode)
		return false;

	bulletNode.updateAbsolutePosition();
	var box = bulletNode.getTransformedBoundingBox();

	var hit = false;

	var nodes = bulletNode.scene.getAllSceneNodesWithAnimator('gameai');

	for (var i=0; i<nodes.length; ++i)
	{				
		if (nodes[i] === this.ShootCollisionNodeToIgnore)
			continue;
			
		var enemyAI = nodes[i].getAnimatorOfType('gameai');

		if (enemyAI && !enemyAI.isAlive()) // don't test collision against dead items
			continue;

		if (box.intersectsWithBox(nodes[i].getTransformedBoundingBox()))
		{
			// hit found
			enemyAI.OnHit(this.ShootCollisionDamage, nodes[i]);
			hit = true;
			break;
		}
	}

	return hit;
}

/**
 * @private
 */
ZICA.AnimatorFlyStraight.prototype.recalculateImidiateValues = function()
{
	this.Vector = this.End.substract(this.Start);
	this.WayLength = this.Vector.getLength();
	this.Vector.normalize();
	this.TimeFactor = this.WayLength / this.TimeForWay;
}


//////////AnimatorOnClick////////////////////////
/**
 * @constructor
 * @public
 * @extends ZICA.Animator
 * @class  Scene node animator which invokes actons when the scene node has been clicked.
 * @param scene {ZICA.Scene} The scene of the animator.
 * @param engine {ZICA} an instance of the 2d engine
 * @param register {Boolean} (optional) set to true to prevent registering at the scene using registerSceneNodeAnimatorForEvents
 */
ZICA.AnimatorOnClick = function(obj)
{
	this.Registered = false;
	this.Occluded = obj.NoClickWhenOccluded; 
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnClick.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnClick, this will return 'onclick'.
 * @public
 */
ZICA.AnimatorOnClick.prototype.getType = function()
{
	return 'onclick';
}


/** 
 * @private
 */
ZICA.AnimatorOnClick.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnClick();
	a.BoundingBoxTestOnly = this.BoundingBoxTestOnly;
	a.CollidesWithWorld = this.CollidesWithWorld;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnClick.prototype.animateNode = function(n, timeMs)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.onClick = function(event , n) 
{	
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnClick.prototype.checkOccluded = function(n,event){
	
	if(!this.Occluded)return false;
	
	var i;
	if(n.isScene)i = 0;
	else i = Game.entityList.indexOf(n) + 1;
	
	for (var _i = i, _a = Game.entityList; _i < _a.length; _i++) {
	 
			var ent_1 = _a[_i];
			var flag = Game.pointInBox(event,ent_1);
			
			if(flag && (ent_1.priority >= n.priority || n.isScene))
				return true;
	}
	
	return false;
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.invokeAction = function(node)
{
	if (this.TheActionHandler)
		this.TheActionHandler.execute(node);
}

/**
 * @private
 */
ZICA.AnimatorOnClick.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnFirstFrame
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnFirstFrame = function(obj)
{
	this.TheActionHandler = obj.Action;
	
}		
ZICA.AnimatorOnFirstFrame.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnFirstFrame, this will return 'onfirstframe'.
 * @private
 */
ZICA.AnimatorOnFirstFrame.prototype.getType = function()
{
	return 'onfirstframe';
}

/** 
 * @private
 */
ZICA.AnimatorOnFirstFrame.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnFirstFrame({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnFirstFrame.prototype.animateNode = function(n, event)
{	
	if(Game.scene.firstFrame)
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnEveryFrame
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnEveryFrame = function(obj)
{
	this.TheActionHandler = obj.Action;
	
}		
ZICA.AnimatorOnEveryFrame.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnEveryFrame, this will return 'oneveryframe'.
 * @private
 */
ZICA.AnimatorOnEveryFrame.prototype.getType = function()
{
	return 'oneveryframe';
}

/** 
 * @private
 */
ZICA.AnimatorOnEveryFrame.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnEveryFrame({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnEveryFrame.prototype.animateNode = function(n, event)
{
	if (this.TheActionHandler)
	this.TheActionHandler.execute(n);
}


//////////AnimatorOnMouse////////////////////////
/**
 * @constructor
 * @public
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnMouse = function(obj)
{
	this.Registered = false;
	this.Occluded = obj.NoClickWhenOccluded;
	this.type = obj.MouseEvent;
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnMouse.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnMouseAnimatorOnMouse, this will return 'onmouse'.
 * @public
 */
ZICA.AnimatorOnMouse.prototype.getType = function()
{
	return 'onmouse';
}


/** 
 * @private
 */
ZICA.AnimatorOnMouse.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnMouse({});
	a.type = this.type;
	a.CollidesWithWorld = this.CollidesWithWorld;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnMouse.prototype.animateNode = function(n, timeMs)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnMouse.prototype.onClick = function(event , n) 
{	
	if(this.type != 'Mouse Click')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseDown = function(event , n) 
{	
	if(this.type != 'Mouse Down')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseUp = function(event , n) 
{	
	if(this.type != 'Mouse Up')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseOver = function(event , n) 
{	
	if(this.type != 'Mouse Over')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.onMouseOut = function(event , n) 
{	
	if(this.type != 'Mouse Out')return;
	this.Registered = true;
	
	if(this.checkOccluded(n,event))return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnMouse.prototype.checkOccluded = function(n,event){
	
	if(!this.Occluded)return false;
	
	var i;
	if(n.isScene)i = 0;
	else i = Game.entityList.indexOf(n) + 1;
	
	for (var _i = i, _a = Game.entityList; _i < _a.length; _i++) {
	 
			var ent_1 = _a[_i];
			var flag = Game.pointInBox(event,ent_1);
			
			if(flag && (ent_1.priority >= n.priority || n.isScene))
				return true;
	}
	
	return false;
}

/**
 * @private
 */
ZICA.AnimatorOnMouse.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

//////////AnimatorOnKey////////////////////////
/**
 * @public
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnKey = function(obj)
{
	this.Registered = false; 
	//this.KeyCode = Number('0x' + (ZICA.Keys.indexOf(obj.Key) + 1));
	this.Key = obj.Key;
	this.KeyEvent = obj.KeyEvent;
	this.TheActionHandler = obj.Action;

}		
ZICA.AnimatorOnKey.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnKey, this will return 'onkey'.
 * @public
 */
ZICA.AnimatorOnKey.prototype.getType = function()
{
	return 'onkey';
}


/** 
 * @private
 */
ZICA.AnimatorOnKey.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnKey({});
	a.Key = this.Key;
	a.KeyEvent = this.KeyEvent;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnKey.prototype.animateNode = function(n, event)
{
	var done = this.Registered;
	this.Registered = false;
	return done;
}

/**
 * @private
 */
ZICA.AnimatorOnKey.prototype.onKeyUp = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed Up')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnKey.prototype.onKeyDown = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed Down')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

ZICA.AnimatorOnKey.prototype.onKeyPress = function(event , n) 
{	
	this.Registered = true;
	
	if(this.KeyEvent != 'Key Pressed')return;
	if(Game.Keys[this.Key.toLowerCase()] != event.which)return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);
	
}

/**
 * @private
 */
ZICA.AnimatorOnKey.prototype.findActionByType = function(type)
{
	if (this.TheActionHandler)
		return this.TheActionHandler.findAction(type);
	
	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////
// Timer animator
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorTimer = function(obj)
{
	this.TimeLastTimed = 0;
	this.TheActionHandler = obj.Action;
	this.TickEverySeconds = obj.IntervalMS;
	this.TimeLastTimed = Date.now();//ZICA.CLTimer.getTime();
}		
ZICA.AnimatorTimer.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorTimer, this will return 'timer'.
 * @private
 */
ZICA.AnimatorTimer.prototype.getType = function()
{
	return 'timer';
}

/** 
 * @private
 */
ZICA.AnimatorTimer.prototype.createClone = function()
{
	var a = new ZICA.AnimatorTimer({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.TimeLastTimed = this.TimeLastTimed;
	a.TickEverySeconds = this.TickEverySeconds;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorTimer.prototype.animateNode = function(n, event)
{
	var timeMs = event.timeElapsed;
	
	if (n == null)
		return false;

	if (this.TickEverySeconds > 0)
	{
		var now = Date.now();//ZICA.CLTimer.getTime();

		if (now - this.TimeLastTimed > this.TickEverySeconds)
		{
			this.TimeLastTimed = now;
			
			if (this.TheActionHandler)
				this.TheActionHandler.execute(n);					
			return true;
		}
	}	
	return false;
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnProximity
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnProximity = function(obj)
{
	this.NodeInside = false;
	this.NodesInside = [];
	
	this.TheActionHandler = obj.Action;
	this.NearToNodes = obj.NearToNodes;
	this.TriggeredWhen = obj.TriggeredWhen;
	
	//'Leaves Radius','Enters Radius'
}		
ZICA.AnimatorOnProximity.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnProximity, this will return 'onproximity'.
 * @private
 */
ZICA.AnimatorOnProximity.prototype.getType = function()
{
	return 'onproximity';
}

/** 
 * @private
 */
ZICA.AnimatorOnProximity.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnProximity({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.NearToNodes = this.NearToNodes;
	a.TriggeredWhen = this.TriggeredWhen;
	a.NodeInside = this.NodeInside;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnProximity.prototype.animateNode = function(n, event)
{
	
	if(this.TriggeredWhen != 'Leaves Radius')return;
	
	if(this.NodeInside){
		
		for (var _i = 0, _a = Game.entityList; _i < _a.length; _i++) {
			var ent = _a[_i];
			
			if(ent != n)
				if(ZICA.boxIntersection(n,ent))return;	
		}
		
		
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
		
		this.NodeInside = false;
		
	}
}

ZICA.AnimatorOnProximity.prototype.onCollision = function(event , n)
{
	
	this.NodeInside = true;
	
	if(this.TriggeredWhen != 'Enters Radius')return;
	
	if(this.NearToNodes != null)
	if(event.other.name != this.NearToNodes) return;
	
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);	
		
}

/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorOnProximity
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorOnProximity = function(obj)
{
	this.NodeInside = false;
	this.NodesInside = [];
	
	this.TheActionHandler = obj.Action;
	this.NearToNodes = obj.NearToNodes;
	
	this.TriggeredWhen = obj.TriggeredWhen;
	
	//'Leaves Radius','Enters Radius'
}		
ZICA.AnimatorOnProximity.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorOnProximity, this will return 'onproximity'.
 * @private
 */
ZICA.AnimatorOnProximity.prototype.getType = function()
{
	return 'onproximity';
}

/** 
 * @private
 */
ZICA.AnimatorOnProximity.prototype.createClone = function()
{
	var a = new ZICA.AnimatorOnProximity({});
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.NearToNodes = this.NearToNodes;
	a.TriggeredWhen = this.TriggeredWhen;
	a.NodeInside = this.NodeInside;
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorOnProximity.prototype.animateNode = function(n, event)
{
	
	if(this.TriggeredWhen != 'Leaves Radius')return;
	
	if(this.NodeInside){
		
		var ent = Game.getEntityById(this.NearToNodes);
		if(!ent)return;
		
		if(ZICA.boxIntersection(n,ent))return;
		
		if (this.TheActionHandler)
			this.TheActionHandler.execute(n);
		
		this.NodeInside = false;
		
	}
}

ZICA.AnimatorOnProximity.prototype.onCollision = function(event , n)
{
	
	this.NodeInside = true;
	
	if(this.TriggeredWhen != 'Enters Radius')return;
	
	//if(this.NearToNodes != null)
	//if(event.other.name != this.NearToNodes) return;
	if(event.other.__guid != this.NearToNodes) return;
	
	if (this.TheActionHandler)
		this.TheActionHandler.execute(n);	
		
}
/////////////////////////////////////////////////////////////////////////////////////////
// AnimatorCollide
/////////////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @class
 * @private
 * @extends ZICA.Animator
 */
ZICA.AnimatorCollide = function(obj)
{
	//this.NodeInside = false;
	
}		
ZICA.AnimatorCollide.prototype = new ZICA.Animator();


/** 
 * Returns the type of the animator.
 * For the AnimatorCollide, this will return 'collide'.
 * @private
 */
ZICA.AnimatorCollide.prototype.getType = function()
{
	return 'collide';
}

/** 
 * @private
 */
ZICA.AnimatorCollide.prototype.createClone = function()
{
	var a = new ZICA.AnimatorCollide({});
	return a;
}


/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @private
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorCollide.prototype.animateNode = function(n, event)
{
	
}

ZICA.AnimatorCollide.prototype.onCollision = function(event , n)
{
	n.x = n.prevX;
	n.y = n.prevY;		
}


///////////////////////////////////////////////////////
// AnimatorAnimateTexture
///////////////////////////////////////////////////////

ZICA.AnimatorAnimateTexture = function(obj)//textures, timeperframe, donotloop)
{
	this.MyStartTime = Date.now();//0;
	
	this.Textures = obj.Textures;
	this.TimePerFrame = obj.TimePerFrame;
	this.Loop = obj.Loop;

}
	
ZICA.AnimatorAnimateTexture.prototype = new ZICA.Animator();

/** 
 * Returns the type of the animator.
 * For the AnimatorAnimateTexture, this will return 'animatetexture'.
 * @public
 */
ZICA.AnimatorAnimateTexture.prototype.getType = function()
{
	return 'animatetexture';
}

/** 
 * @private
 */
ZICA.AnimatorAnimateTexture.prototype.createClone = function()
{
	var a = new ZICA.AnimatorAnimateTexture({});
	a.Textures = this.Textures;
	a.Loop = this.Loop;
	a.TimePerFrame = this.TimePerFrame;
	return a;
}

/**
 * Animates the scene node it is attached to and returns true if scene node was modified.
 * @public
 * @param {ZICA.Entity} n The Scene node which needs to be animated this frame.
 * @param {Integer} timeMs The time in milliseconds since the start of the scene.
 */
ZICA.AnimatorAnimateTexture.prototype.animateNode = function(n, event)
{
	if (n == null || this.Textures == null)
		return false;
		
	var changedSomething = false;
	var timeMs = Date.now();//event.timeElapsed;
	
	if (this.Textures.length)
	{
		var startTime = (this.MyStartTime == 0) ? 0 : this.MyStartTime;
		
		var t = (timeMs - startTime);
		var endTime = startTime + (this.TimePerFrame * this.Textures.length);

		var idx = 0;
		if (!this.Loop && timeMs >= endTime)
			idx = this.Textures.length - 1;
		else
		{
			if (this.TimePerFrame > 0)
				idx = Math.floor((t/this.TimePerFrame) % this.Textures.length);
			else
				idx = 0;
		}

		if (idx < this.Textures.length)
		{
			n.image = this.Textures[idx];
			changedSomething = true;
		}
	}
	
	return changedSomething;
}

/** 
 * @private
 */
ZICA.AnimatorAnimateTexture.prototype.reset = function()
{
	this.MyStartTime = Date.now();
}


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// ---------------------------------------------------------------------
// Action 
// ---------------------------------------------------------------------
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


/**
 * @constructor
 * @private
 */
ZICA.Action = function()
{
}

/**
 * @private
 */
ZICA.Action.prototype.execute = function(node)
{
}

/**
 * @private
 */
ZICA.Action.prototype.createClone = function()
{
	return null;
}

/////////ActionHandler//////////

/**
 * @constructor
 * @private
 * @class
 */
ZICA.ActionHandler = function(array) //,scene
{
	if(!array)array = [];
	
	this.Actions = array;
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.execute = function(node)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		 this.Actions[i].execute(node);
	}
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.addAction = function(a)
{
	if (a == null)
		return;
		
	this.Actions.push(a);
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.findAction = function(type)
{
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.Type == type)
			return a;
	}
	
	return null;
}

/**
 * @private
 */
ZICA.ActionHandler.prototype.createClone = function()
{
	var c = new ZICA.ActionHandler();
	
	for (var i=0; i<this.Actions.length; ++i)
	{
		var a = this.Actions[i];
		if (a.createClone != null)
			c.addAction(a.createClone());
	}
	
	return c;
}


// ---------------------------------------------------------------------
// Action ExecuteJavaScript
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ExecuteJavaScript = function(obj)
{
	this.Type = 'ExecuteJavaScript';	
	this.JScript = obj.JavaScript;
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.createClone = function()
{
	var a = new ZICA.Action.ExecuteJavaScript();
	a.JScript = this.JScript;
	return a;
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.execute = function(currentNode)
{
	this.eval.call(currentNode,this.JScript);
	
}

/**
 * @private
 */
ZICA.Action.ExecuteJavaScript.prototype.eval = function(JScript)
{
	eval(JScript);
}

// ---------------------------------------------------------------------
// Action MakeSceneNodeInvisible
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.MakeSceneNodeInvisible = function(obj)
{
	this.InvisibleMakeType = ['Make Invisible' , 'Make Visible' , 'Toggle Visiblilty'].indexOf(obj.InvisibleMakeType);
	this.SceneNodeToMakeInvisible = obj.SceneNodeToMakeInvisible;
	this.ChangeCurrentSceneNode = obj.SceneNodeToMakeInvisible == null;
	this.Type = 'MakeSceneNodeInvisible';	
}

/**
 * @private
 */
ZICA.Action.MakeSceneNodeInvisible.prototype.createClone = function()
{
	var a = new ZICA.Action.MakeSceneNodeInvisible({});
	a.InvisibleMakeType = this.InvisibleMakeType;
	a.SceneNodeToMakeInvisible = this.SceneNodeToMakeInvisible;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.MakeSceneNodeInvisible.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToMakeInvisible != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToMakeInvisible);

	if (nodeToHandle)
	{
		switch(this.InvisibleMakeType)
		{
		case 0: //EIT_MAKE_INVISIBLE:
			nodeToHandle.visible = false;
			break;
		case 1: //EIT_MAKE_VISIBLE:
			nodeToHandle.visible = true;
			break;
		case 2: //EIT_TOGGLE_VISIBILITY:
			{
				nodeToHandle.visible = !nodeToHandle.visible;
			}
			break;
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeScale
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeScale = function(obj)
{
	this.Type = 'ChangeSceneNodeScale';	
	
	switch(obj.ScaleChangeType)
	{
		case 'Set absoulte scale':
		this.ScaleChangeType = 0;
		break;
		case 'Scale by the vector' :
		this.ScaleChangeType = 1;
		break;
		case 'Set relative scale':
		this.ScaleChangeType = 2;
		break;
	}
	
	this.SceneNodeToChangeScale = obj.SceneNodeToChangeScale;
	if(obj.SceneNodeToChangeScale == null)this.ChangeCurrentSceneNode = true;
	this.Size = obj.Size.clone();
}	

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeScale.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeScale({});
	a.ScaleChangeType = this.ScaleChangeType;
	a.SceneNodeToChangeScale = this.SceneNodeToChangeScale;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Size = this.Size.clone();
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeScale.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeScale != -1)
		nodeToHandle =  Game.getEntityById(this.SceneNodeToChangeScale);

	if (nodeToHandle)
	{
		switch(this.ScaleChangeType)
		{
		case 0: //EIT_ABSOLUTE_SCALE:
			nodeToHandle.width = this.Size.X;
			nodeToHandle.height = this.Size.Y;
			break;
		case 1: //MULTIPLY_SCALE:
			nodeToHandle.width *= this.Size.X;
			nodeToHandle.height *= this.Size.Y;
			break;
		case 2: //EIT_RELATIVE_SCALE:
			nodeToHandle.width += this.Size.X;
			nodeToHandle.height += this.Size.Y;
			break;

		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeRotation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeRotation = function(obj)
{
	this.Type = 'ChangeSceneNodeRotation';
	
	this.RotationChangeType = obj.RotationChangeType == 'Set absoulte rotation'? 0: 1; 
	this.SceneNodeToChangeRotation = obj.SceneNodeToChangeRotation;
	if(obj.SceneNodeToChangeRotation == null)this.ChangeCurrentSceneNode = true;
	this.Angle = obj.Angle;
	this.RotateAnimated = obj.RotateAnimated;
	this.TimeNeededForRotationMs = obj.TimeNeededForRotationMs;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeRotation.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeRotation({});
	a.RotationChangeType = this.RotationChangeType;
	a.SceneNodeToChangeRotation = this.SceneNodeToChangeRotation;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Angle = this.Angle;
	a.RotateAnimated = this.RotateAnimated;
	a.TimeNeededForRotationMs = this.TimeNeededForRotationMs;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeRotation.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeRotation != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangeRotation);

	if (nodeToHandle)
	{
		var finalRot = null;
		
		switch(this.RotationChangeType)
		{
		case 0://EIT_ABSOLUTE_ROTATION:
			finalRot = this.Angle;
			break;
		case 1://EIT_RELATIVE_ROTATION:
			finalRot = nodeToHandle.angle + this.Angle;
			break;
		}
		
		if (finalRot)
		{
			if (!this.RotateAnimated)
			{
				// not animated, set rotation directly
				nodeToHandle.angle = finalRot;
			}
			else
			{
				// rotate animated to target TO DO!!!
				var anim = new ZICA.AnimatorRotation({});
				anim.setRotateToTargetAndStop(finalRot, nodeToHandle.angle, this.TimeNeededForRotationMs);
										
				nodeToHandle.addAnimator(anim);
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodePosition
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePosition = function(obj)
{
	this.UseAnimatedMovement = obj.UseAnimatedMovement;//false;
	this.TimeNeededForMovementMs = obj.TimeNeededForMovementMs //false;
	
	this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	if(obj.SceneNodeToChangePosition == null)this.ChangeCurrentSceneNode = true;
	
	
	if(obj.PositionChangeType == 0){
		this.PositionChangeType = 0;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Position.clone();
	}
	
	if(obj.PositionChangeType == 1){
		this.PositionChangeType = 1;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Vector.clone();
	}
	
	if(obj.PositionChangeType == 2){
		this.PositionChangeType = 2;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Position.clone();
		this.SceneNodeRelativeTo = obj.SceneNodeRelativeTo;
		if(obj.SceneNodeRelativeTo == null)this.RelativeToCurrentSceneNode = true;
	}
	
	if(obj.PositionChangeType == 3){
		this.PositionChangeType = 3;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.Percentage.clone();
		this.SceneNodeRelativeTo = obj.SceneNodeRelativeTo;
		if(obj.SceneNodeRelativeTo == null)this.RelativeToCurrentSceneNode = true;
	}
	
	if(obj.PositionChangeType == 4){
		this.PositionChangeType = 4;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
		this.Vector = obj.MinPosition.clone();
		this.Area3DEnd = obj.MaxPosition.clone();
	}
	
	if(obj.PositionChangeType == 5){
		this.PositionChangeType = 5;
		//this.SceneNodeToChangePosition = obj.SceneNodeToChangePosition;
	}
	

	this.Type = 'ChangeSceneNodePosition';	
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePosition.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePosition({});
	a.PositionChangeType = this.PositionChangeType;
	a.SceneNodeToChangePosition = this.SceneNodeToChangePosition;
	a.SceneNodeRelativeTo = this.SceneNodeRelativeTo;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.RelativeToCurrentSceneNode = this.RelativeToCurrentSceneNode;
	a.Vector = this.Vector ? this.Vector.clone() : null;
	a.Area3DEnd = this.Area3DEnd ? this.Area3DEnd.clone() : null;
	a.UseAnimatedMovement = this.UseAnimatedMovement;
	a.TimeNeededForMovementMs = this.TimeNeededForMovementMs;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePosition.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangePosition != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangePosition);

	if (nodeToHandle)
	{
		var finalpos = null;
		
		switch(this.PositionChangeType)
		{
		case 0: //EIT_ABSOLUTE_POSITION:
			finalpos = this.Vector.clone();
			break;
		case 1://EIT_RELATIVE_POSITION:
			finalpos = new ZICA.Vect2d(nodeToHandle.x + this.Vector.X,nodeToHandle.y + this.Vector.Y);
			break;
		case 2://EIT_RELATIVE_TO_SCENE_NODE:
			{
				var nodeRelativeTo = null;
				if (this.RelativeToCurrentSceneNode)
					nodeRelativeTo = currentNode;
				else
				if (this.SceneNodeRelativeTo != -1)
					nodeRelativeTo = Game.getEntityById(this.SceneNodeRelativeTo);

				if (nodeRelativeTo)
					finalpos = new ZICA.Vect2d(nodeRelativeTo.x + this.Vector.X,nodeRelativeTo.y + this.Vector.Y);
			}
			break;
		case 3: //EIT_RELATIVE_IN_FACING_DIRECTION:
			{
				var nodeRelativeTo = null;
				if (this.RelativeToCurrentSceneNode)
					nodeRelativeTo = Game;
				else
				if (this.SceneNodeRelativeTo != -1)
					nodeRelativeTo = Game.getEntityById(this.SceneNodeRelativeTo);

				if (nodeRelativeTo)
					finalpos = new ZICA.Vect2d(nodeRelativeTo.x + nodeRelativeTo.width*this.Vector.X/100, nodeRelativeTo.y + nodeRelativeTo.height*this.Vector.Y/100);
			}
			break;
		case 4: //EIT_RANDOM_POSITION:
			{
				
				finalpos = new ZICA.Vect2d();
				finalpos.X = this.Vector.X + (Math.random() * (this.Area3DEnd.X - this.Vector.X));
				finalpos.Y = this.Vector.Y + (Math.random() * (this.Area3DEnd.Y - this.Vector.Y));
				
			}
			break;
		case 5: //EIT_RELATIVE_TO_LAST_BULLET_IMPACT:
			{	
				finalpos = new ZICA.Vect2d(Game.controls.mouse.x,Game.controls.mouse.y);
			}
			break;
		}
		
		if (finalpos != null)
		{
			if (this.UseAnimatedMovement && this.TimeNeededForMovementMs > 0)
			{
				// move animated to target TO DO !!!
				var anim = new ZICA.AnimatorFlyStraight({});
				anim.Start = new ZICA.Vect2d(nodeToHandle.x,nodeToHandle.y);
				anim.End = finalpos;
				anim.TimeForWay = this.TimeNeededForMovementMs;
				anim.DeleteMeAfterEndReached = true;
				anim.recalculateImidiateValues();
				
				nodeToHandle.addAnimator(anim);
			}
			else
			{
				// set position directly
				nodeToHandle.x = finalpos.X;
				nodeToHandle.y = finalpos.Y;
			}
		}
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodeProperty
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodeProperty = function(obj)
{
	this.Type = 'ChangeSceneNodeProperty';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.Value = obj.Value;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeProperty.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodeProperty({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Property = this.Property;
	a.Value = this.Value;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodeProperty.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		nodeToHandle[this.Property] = this.Value;
	}
}


// ---------------------------------------------------------------------
// Action ChangeSceneNodePropertyFromNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePropertyFromNode = function(obj)
{
	this.Type = 'ChangeSceneNodePropertyFromNode';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.SceneNodeFrom = obj.SceneNodeFrom;
	if(obj.SceneNodeFrom == null)this.FromCurrentSceneNode = true;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyFromNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePropertyFromNode({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.SceneNodeFrom = this.SceneNodeFrom;
	a.FromCurrentSceneNode = this.FromCurrentSceneNode;
	a.Property = this.Property;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyFromNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeFrom = null;
	if (this.FromCurrentSceneNode)
		nodeFrom = currentNode;
	else
	if (this.SceneNodeFrom != -1)
		nodeFrom = Game.getEntityById(this.SceneNodeFrom);


	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		nodeToHandle[this.Property] = nodeFrom[this.Property];
	}
}

// ---------------------------------------------------------------------
// Action ChangeSceneNodePropertyVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ChangeSceneNodePropertyVariable = function(obj)
{
	this.Type = 'ChangeSceneNodePropertyVariable';	
	
	this.SceneNodeToChange = obj.SceneNodeToChange;
	if(obj.SceneNodeToChange == null)this.ChangeCurrentSceneNode = true;
	this.Property = obj.Property;
	this.Variable = obj.Variable;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.ChangeSceneNodePropertyVariable({});
	a.SceneNodeToChange = this.SceneNodeToChange;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Property = this.Property;
	a.Variable = this.Variable;
	
	return a;
}

/**
 * @private
 */
ZICA.Action.ChangeSceneNodePropertyVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChange != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChange);

	if (nodeToHandle)
	{
		if(Game.hasVariable(this.Variable))
		nodeToHandle[this.Property] = Game.getVariable(this.Variable);
	}
}

// ---------------------------------------------------------------------
// Action ActionRestartScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SwitchToScene = function(obj)
{
	this.Scene = obj.SceneId;//obj.Scene;
	this.ResetScene = obj.ResetScene;
	this.Type = 'SwitchToScene';	
}

/**
 * @private
 */
ZICA.Action.SwitchToScene.prototype.createClone = function()
{
	var a = new ZICA.Action.SwitchToScene({});
	a.Scene = this.Scene;
	a.ResetScene = this.ResetScene;
	return a;
}

/**
 * @private
 */
ZICA.Action.SwitchToScene.prototype.execute = function(currentNode)
{
	//var scene = Game.getSceneByName(this.Scene);
	var scene = Game.getScene(this.Scene);
	
	if(scene)
	Game.switchToScene(scene,this.ResetScene);
}

// ---------------------------------------------------------------------
// Action ActionRestartScene
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.RestartScene = function()
{
	this.Type = 'RestartScene';	
}

/**
 * @private
 */
ZICA.Action.RestartScene.prototype.createClone = function()
{
	var a = new ZICA.Action.RestartScene();
	return a;
}

/**
 * @private
 */
ZICA.Action.RestartScene.prototype.execute = function(currentNode)
{
	if (Game.scene)
		Game.switchToScene(Game.scene, true);
}

// ---------------------------------------------------------------------
// Action OpenWebpage
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.OpenWebpage = function(obj)
{
	this.Type = 'OpenWebpage';	
	this.Webpage = obj.Webpage;
	this.Target = obj.Target;
}

/**
 * @private
 */
ZICA.Action.OpenWebpage.prototype.createClone = function()
{
	var a = new ZICA.Action.OpenWebpage({});
	a.Webpage = this.Webpage;
	a.Target = this.Target;
	return a;
}

/**
 * @private
 */
ZICA.Action.OpenWebpage.prototype.execute = function(currentNode)
{
	window.open(this.Webpage, this.Target);
}

// ---------------------------------------------------------------------
// Action OpenWebpage
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ExitApplication = function(obj)
{
	this.Type = 'ExitApplication';	
}

/**
 * @private
 */
ZICA.Action.ExitApplication.prototype.createClone = function()
{
	var a = new ZICA.Action.ExitApplication({});
	return a;
}

/**
 * @private
 */
ZICA.Action.ExitApplication.prototype.execute = function(currentNode)
{
	window.close();
}

// ---------------------------------------------------------------------
// Action SetOrChangeAVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SetOrChangeAVariable = function(obj)
{
	// variables set in loader
	var oper = ['Set(=)','Add(+)','Substract(-)','Divide(/)','Divide INT(/)','Multiply(*)','Multiply INT(*)'];
	
	this.VariableName = obj.VariableName;
	this.Operation = oper.indexOf(obj.Operation);
	this.ValueType = obj.ValueType == 'Value'?0:1;
	this.Value = obj.Value;
	
	this.Type = 'SetOrChangeAVariable';	
}

/**
 * @private
 */
ZICA.Action.SetOrChangeAVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.SetOrChangeAVariable({});
	a.VariableName = this.VariableName;
	a.Operation = this.Operation;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	return a;
}

/**
 * @private
 */
ZICA.Action.SetOrChangeAVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
				
	if (this.VariableName == null)
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	if (var1 == true)
		var1 = Game.getVariable(this.VariableName);
	else
		var1 = 0;
		
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = Game.getVariable(this.Value);	
		if (var2 == null)
			return; // operand variable not existing
	}else
		var2 = this.Value;

	
	switch(this.Operation)
	{
	case 0: //EO_SET:
		var1 = var2;
		break;
	case 1: //EO_ADD:
		var1 += var2;
		break;
	case 2: //EO_SUBSTRACT:
		var1 -= var2;
		break;
	case 3: //EO_DIVIDE:
		var1 /= var2;
		break;
	case 4: //EO_DIVIDE_INT:
		var1 = Math.round(var1 / var2);
		break;
	case 5: //EO_MULTIPLY:
		var1 *= var2;
		break;
	case 6: //EO_MULTIPLY_INT:
		var1 = Math.round(var1 * var2);
		break;
	}		

	Game.setVariable(this.VariableName , var1);
}

// ---------------------------------------------------------------------
// Action IfVariable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.IfVariable = function(obj)
{
	var comp = ['Is equal to (=)','Is not equal to (<>)','Is bigger than (>)','Is smaller than (<)'];
	
	this.VariableName = obj.VariableName;
	this.ComparisonType = comp.indexOf(obj.ComparisonType);
	this.ValueType = obj.ValueType == 'Value'?0:1;
	this.Value = obj.Value;
	this.TheActionHandler = obj.Action;
	this.TheElseActionHandler = obj.Else;
	
	this.Type = 'IfVariable';	
}

/**
 * @private
 */
ZICA.Action.IfVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.IfVariable({});
	a.VariableName = this.VariableName;
	a.ComparisonType = this.ComparisonType;
	a.ValueType = this.ValueType;
	a.Value = this.Value;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;
	a.TheElseActionHandler = this.TheElseActionHandler ? this.TheElseActionHandler.createClone() : null;
	return a;
}

/**
 * @private
 */
ZICA.Action.IfVariable.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
		
	if (this.VariableName == null)
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	if (var1 == null) // should not happen since the function above creates if not found
		return;
	
	var1 = Game.getVariable(this.VariableName);
	var var2 = null;

	if (this.ValueType == 1) //EO_VARIABLE)
	{
		var2 = Game.hasVariable(this.Value);
		if (var2 == false) // should not happen since the function above creates if not found
		return;
	
		var2 = Game.getVariable(this.Value);
	}else
		var2 = this.Value;
	
	var execute = false;

	switch(this.ComparisonType)
	{
	case 0: //EO_EQUAL:
	case 1: //EO_NOT_EQUAL:
		{
			execute = (var1 == var2)
			if (this.ComparisonType == 1) //EO_NOT_EQUAL)
				execute = !execute;	
			break;
		}
	case 2: //EO_BIGGER_THAN:
		{
			execute = var1 > var2;
		}
		break;
	case 3: //EO_SMALLER_THAN:
		{
			execute = var1 < var2;
		}
		break;
	}			
	
	if (execute)
	{
		if (this.TheActionHandler)
			this.TheActionHandler.execute(currentNode);
	}
	else
	{
		if (this.TheElseActionHandler)
			this.TheElseActionHandler.execute(currentNode);
	}
}

// ---------------------------------------------------------------------
// Action Store Load Variable
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionStoreLoadVariable = function(obj)
{
	this.Type = 'StoreLoadVariable';
	this.Load = (obj.Load == 'Load Variable')?true:false;
	this.VariableName = obj.VariableName;
}

/**
 * @private
 */
ZICA.Action.ActionStoreLoadVariable.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionStoreLoadVariable({});
	a.Load = this.Load;
	a.VariableName = this.VariableName;
	return a;
}

ZICA.Action.ActionStoreLoadVariable.prototype.setCookie = function(cookieName, value, expdays)
{
	var expdate = new Date();
	expdate.setDate(expdate.getDate() + expdays);
	var cvalue = escape(value) + ("; expires=" + expdate.toUTCString());
	document.cookie = cookieName + "=" + cvalue;
}

ZICA.Action.ActionStoreLoadVariable.prototype.getCookie = function(cookieName)
{
	var ARRcookies = document.cookie.split(";");
	for (var i=0; i<ARRcookies.length; ++i)
	{
		var cookie = ARRcookies[i];
		var equalspos = cookie.indexOf("=");
		var varname = cookie.substr(0, equalspos);
		
		varname = varname.replace(/^\s+|\s+$/g,"");
		
		if (varname == cookieName)
			return unescape(cookie.substr(equalspos+1));
	}
	
	return null;
}

/**
 * @private
 */
ZICA.Action.ActionStoreLoadVariable.prototype.execute = function(currentNode)
{
	if (this.VariableName == null || this.VariableName == "")
		return;
		
	var var1 = Game.hasVariable(this.VariableName);
	
		try
		{			
			if (this.Load)
			{
				// load
				//Game.setVariable(this.VariableName, this.getCookie(this.VariableName));
				var var2 = window.localStorage.getItem(this.VariableName);
				if(var2)
				Game.setVariable(this.VariableName, var2);
			}
			else
			{
				// save
				if(var1)
				window.localStorage.setItem(this.VariableName, Game.getVariable(this.VariableName)) 
				//this.setCookie(this.VariableName, Game.getVariable(this.VariableName), 99);
			}
		}
		catch(e)
		{
			//Debug.print("error loading/saving data");
		}
	
}

// ---------------------------------------------------------------------
// Action PlaySound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionPlaySound = function(obj)
{
	var mode = ['Play Audio','Stop Audio','Toggle Audio'];
	
	this.SceneNodeToPlay = obj.SceneNodeToPlay;
	if(obj.SceneNodeToPlay == null)this.PlayCurrentSceneNode = true;
	this.Mode = mode.indexOf(obj.Mode);
	this.Type = 'PlaySound';	
}

/**
 * @private
 */
ZICA.Action.ActionPlaySound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionPlaySound({});
	a.SceneNodeToPlay = this.SceneNodeToPlay;
	a.PlayCurrentSceneNode = this.PlayCurrentSceneNode;;
	a.Mode = this.Mode;
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionPlaySound.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeToHandle = null;
	if (this.PlayCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlay != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToPlay);
	
	if (nodeToHandle)
	{
		if(!nodeToHandle.__audio)return;
		
		nodeToHandle.__audio.currentTime = 0;
		
		if(this.Mode == 0)
			nodeToHandle.playAudio();
		else if(this.Mode == 1)
			nodeToHandle.stopAudio();
		else
			nodeToHandle.__audio.paused?nodeToHandle.playAudio():nodeToHandle.stopAudio();
	}
}

// ---------------------------------------------------------------------
// Action ResumeSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionResumeSound = function(obj)
{
	var mode = ['Resume Audio','Pause Audio','Toggle Audio'];
	
	this.SceneNodeToPlay = obj.SceneNodeToPlay;
	if(obj.SceneNodeToPlay == null)this.PlayCurrentSceneNode = true;
	this.Mode = mode.indexOf(obj.Mode);
	this.Type = 'PlaySound';	
}

/**
 * @private
 */
ZICA.Action.ActionResumeSound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionResumeSound({});
	a.SceneNodeToPlay = this.SceneNodeToPlay;
	a.PlayCurrentSceneNode = this.PlayCurrentSceneNode;;
	a.Mode = this.Mode;
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionResumeSound.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;
	
	var nodeToHandle = null;
	if (this.PlayCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToPlay != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToPlay);
	
	if (nodeToHandle)
	{
		if(!nodeToHandle.__audio)return;
		
		//nodeToHandle.__audio.currentTime = 0;
		
		if(this.Mode == 0)
			nodeToHandle.playAudio();
		else if(this.Mode == 1)
			nodeToHandle.pauseAudio();
		else
			nodeToHandle.__audio.paused?nodeToHandle.playAudio():nodeToHandle.pauseAudio();
	}
}

// ---------------------------------------------------------------------
// Action StopSound
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionStopSound = function()
{
	this.Type = 'StopSound';	
}

/**
 * @private
 */
ZICA.Action.ActionStopSound.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionStopSound();
	return a;
}

/**
 * @private
 */
ZICA.Action.ActionStopSound.prototype.execute = function(currentNode)
{
	Game.stopAllSounds();
}

// ---------------------------------------------------------------------
// Action ActionDeleteSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionDeleteSceneNode = function(obj)
{
	this.Type = 'ActionDeleteSceneNode';	
	
	this.SceneNodeToDelete = obj.SceneNodeToDelete;
	if(this.SceneNodeToDelete == null)this.DeleteCurrentSceneNode = true;
}

/**
 * @private
 */
ZICA.Action.ActionDeleteSceneNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionDeleteSceneNode({});
	a.SceneNodeToDelete = this.SceneNodeToDelete;
	a.DeleteCurrentSceneNode = this.DeleteCurrentSceneNode;
	a.TimeAfterDelete = this.TimeAfterDelete;

	return a;
}

/**
 * @private
 */
ZICA.Action.ActionDeleteSceneNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.DeleteCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToDelete != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToDelete);

	if (nodeToHandle != null)
		nodeToHandle.__removeFlag = true;
		//sceneManager.addToDeletionQueue(nodeToHandle, this.TimeAfterDelete);
}

// ---------------------------------------------------------------------
// Action RestartBehaviors
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.RestartBehaviors = function(obj)
{
	this.SceneNodeToRestart = obj.SceneNodeToRestart;
	if(this.SceneNodeToRestart == null)this.ChangeCurrentSceneNode = true;
	this.Type = 'RestartBehaviors';	
}

/**
 * @private
 */
ZICA.Action.RestartBehaviors.prototype.createClone = function()
{
	var a = new ZICA.Action.RestartBehaviors({});
	a.SceneNodeToRestart = this.SceneNodeToRestart;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;

	return a;
}

/**
 * @private
 */
ZICA.Action.RestartBehaviors.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToRestart != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToRestart);

	if (nodeToHandle)
	{
		for (var i = 0; i<nodeToHandle.animators.length; ++i)
		{
			var a = nodeToHandle.animators[i];
			if (a != null)
				a.reset();
		}
	}
}

// ---------------------------------------------------------------------
// Action ActionCloneSceneNode
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.ActionCloneSceneNode = function(obj)
{
	this.SceneNodeToClone = obj.SceneNodeToClone;
	if(this.SceneNodeToClone == null)this.CloneCurrentSceneNode = true;
	this.TheActionHandler = obj.ActionToDoWhitClone;
	
	this.Type = 'ActionCloneSceneNode';	
}

/**
 * @private
 */
ZICA.Action.ActionCloneSceneNode.prototype.createClone = function()
{
	var a = new ZICA.Action.ActionCloneSceneNode({});
	a.SceneNodeToClone = this.SceneNodeToClone;
	a.CloneCurrentSceneNode = this.CloneCurrentSceneNode;
	a.TheActionHandler = this.TheActionHandler ? this.TheActionHandler.createClone() : null;

	return a;
}

/**
 * @private
 */
ZICA.Action.ActionCloneSceneNode.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.CloneCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToClone != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToClone);

	if (nodeToHandle)
	{
		// clone
		var cloned = Game.cloneEntity(nodeToHandle);
		
		if (cloned != null)
		{
			// run action on clone
	
			if (this.TheActionHandler)
				this.TheActionHandler.execute(cloned);
		}
	}
}

// ---------------------------------------------------------------------
// Action SetSceneNodeAnimation
// ---------------------------------------------------------------------

/**
 * @private
 * @constructor
 * @class
 */
ZICA.Action.SetSceneNodeAnimation = function(obj)
{
	this.SceneNodeToChangeAnim = obj.SceneNodeToChangeAnim;
	if(this.SceneNodeToChangeAnim == null)this.ChangeCurrentSceneNode = true;
	this.Loop = obj.Loop;
	this.AnimName = obj.AnimName;
	
	this.Type = 'SetSceneNodeAnimation';
}

/**
 * @private
 */
ZICA.Action.SetSceneNodeAnimation.prototype.createClone = function()
{
	var a = new ZICA.Action.SetSceneNodeAnimation({});
	a.SceneNodeToChangeAnim = this.SceneNodeToChangeAnim;
	a.ChangeCurrentSceneNode = this.ChangeCurrentSceneNode;
	a.Loop = this.Loop;
	a.AnimName = this.AnimName;
		
	return a;
}

/**
 * @private
 */
ZICA.Action.SetSceneNodeAnimation.prototype.execute = function(currentNode)
{
	if (!currentNode)
		return;

	var nodeToHandle = null;
	if (this.ChangeCurrentSceneNode)
		nodeToHandle = currentNode;
	else
	if (this.SceneNodeToChangeAnim != -1)
		nodeToHandle = Game.getEntityById(this.SceneNodeToChangeAnim);

	if (nodeToHandle)
	{
		// set animation
		
		var animatedMesh = nodeToHandle;
		animatedMesh.animation = this.AnimName;
		animatedMesh.animLoop = this.Loop;

	}
}