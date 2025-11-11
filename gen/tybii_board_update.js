export function write_BoardGroupUpdate(w, s) {
  w.writeId(s.id);
  w.writeString(s.memberId);
}

export function write_BoardAddUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardDeleteUpdate(w, s) {
  w.writeId(s.id);
}

export function write_BoardStrokeUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardMoveUpdate(w, s) {
  w.writeId(s.id);
  w.writeNumber(s.deltaX);
  w.writeNumber(s.deltaY);
}

export function write_BoardAddPointUpdate(w, s) {
  w.writeId(s.id);
  w.writeNumber(s.pointX);
  w.writeNumber(s.pointY);
}

export function write_BoardSetImageUpdate(w, s) {
  w.writeId(s.id);
  w.writeString(s.src);
  w.writeNumber(s.width);
  w.writeNumber(s.height);
}

export function write_BoardShapeUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardAnimationUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardAnchorUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardTextUpdate(w, s) {
throw new Error('OKFAIL Not supported');}

export function write_BoardUpdate(w, s) {
  switch(s.type) {
  case "addMember":
    w.writeBits(0, 4);
    write_BoardGroupUpdate(w, s);
    break;

  case "addObject":
    w.writeBits(1, 4);
    write_BoardAddUpdate(w, s);
    break;

  case "deleteObject":
    w.writeBits(2, 4);
    write_BoardDeleteUpdate(w, s);
    break;

  case "setStroke":
    w.writeBits(3, 4);
    write_BoardStrokeUpdate(w, s);
    break;

  case "move":
    w.writeBits(4, 4);
    write_BoardMoveUpdate(w, s);
    break;

  case "addPoint":
    w.writeBits(5, 4);
    write_BoardAddPointUpdate(w, s);
    break;

  case "setImage":
    w.writeBits(6, 4);
    write_BoardSetImageUpdate(w, s);
    break;

  case "setShape":
    w.writeBits(7, 4);
    write_BoardShapeUpdate(w, s);
    break;

  case "setAnimation":
    w.writeBits(8, 4);
    write_BoardAnimationUpdate(w, s);
    break;

  case "setAnchor":
    w.writeBits(9, 4);
    write_BoardAnchorUpdate(w, s);
    break;

  case "setText":
    w.writeBits(10, 4);
    write_BoardTextUpdate(w, s);
    break;

  }
}

export function read_BoardGroupUpdate(r) {
  const s = {};
  s.type = "addMember";
  s.id = r.readId();
  s.memberId = r.readString();
  return s;
}

export function read_BoardAddUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardDeleteUpdate(r) {
  const s = {};
  s.type = "deleteObject";
  s.id = r.readId();
  return s;
}

export function read_BoardStrokeUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardMoveUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "move";
  s.deltaX = r.readNumber();
  s.deltaY = r.readNumber();
  return s;
}

export function read_BoardAddPointUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "addPoint";
  s.pointX = r.readNumber();
  s.pointY = r.readNumber();
  return s;
}

export function read_BoardSetImageUpdate(r) {
  const s = {};
  s.id = r.readId();
  s.type = "setImage";
  s.src = r.readString();
  s.width = r.readNumber();
  s.height = r.readNumber();
  return s;
}

export function read_BoardShapeUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardAnimationUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardAnchorUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardTextUpdate(r) {
throw new Error('OKFAIL Not supported');}

export function read_BoardUpdate(r) {
  switch(r.readBits(4)) {
  case 0:
    return read_BoardGroupUpdate(r);

  case 1:
    return read_BoardAddUpdate(r);

  case 2:
    return read_BoardDeleteUpdate(r);

  case 3:
    return read_BoardStrokeUpdate(r);

  case 4:
    return read_BoardMoveUpdate(r);

  case 5:
    return read_BoardAddPointUpdate(r);

  case 6:
    return read_BoardSetImageUpdate(r);

  case 7:
    return read_BoardShapeUpdate(r);

  case 8:
    return read_BoardAnimationUpdate(r);

  case 9:
    return read_BoardAnchorUpdate(r);

  case 10:
    return read_BoardTextUpdate(r);

  }
}

