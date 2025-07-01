const Counter = require('./../global/Counter');

// Get counter by ID
exports.getCounter = async (req, res) => {
    try {
        const counter = await Counter.find();
        res.status(200).json(counter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update seq by matching current seq value
exports.updateSeqBySeq = async (req, res) => {
    try {
        const currentSeq = parseInt(req.params.seq);   // current seq to match
        const newSeq = parseInt(req.body.newSeq);      // new seq to set

        const counter = await Counter.findOneAndUpdate(
            { seq: currentSeq },                        // match current seq
            { $set: { seq: newSeq } },                  // update to new seq
            { new: true }
        );

        if (!counter) {
            return res.status(404).json({ message: "Counter with specified seq not found" });
        }

        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update counter by current seq value
exports.incrementBySeq = async (req, res) => {
    try {
        const currentSeq = parseInt(req.params.seq); // get seq from params
        const counter = await Counter.findOneAndUpdate(
            { seq: currentSeq },                        // match by current seq
            { $inc: { seq: currentSeq } },              // increment by current seq
            { new: true }                               // return updated doc
        );

        if (!counter) {
            return res.status(404).json({ message: "Counter with specified seq not found" });
        }

        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update counter manually (e.g., reset or set to a specific value)
exports.updateCounter = async (req, res) => {
    const { seq } = req.body;
    if (typeof seq !== 'number') {
        return res.status(400).json({ message: 'Invalid sequence number' });
    }

    try {
        const counter = await Counter.findOneAndUpdate(
            { id: req.params.id },
            { $set: { seq } },
            { new: true }
        );
        if (!counter) return res.status(404).json({ message: 'Counter not found' });
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete counter
exports.deleteCounter = async (req, res) => {
    try {
        const result = await Counter.findOneAndDelete({ id: req.params.id });
        if (!result) return res.status(404).json({ message: 'Counter not found' });
        res.json({ message: 'Counter deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
